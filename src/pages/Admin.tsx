import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  useProjects,
  useSkills,
  useEducation,
  useSocialLinks,
  type Project,
  type Skill,
  type Education,
  type SocialLink,
} from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialIcon, SOCIAL_ICON_OPTIONS } from "@/lib/socialIcons";
import { toast } from "sonner";
import { Trash2, Pencil, X } from "lucide-react";

const emptyProject = {
  title: "",
  description: "",
  image_url: "",
  tags: "",
  live_url: "",
  repo_url: "",
  period: "",
  sort_order: 0,
};
const emptySkill = { name: "", sort_order: 0 };
const emptyEducation = { institution: "", program: "", period: "", description: "", sort_order: 0 };
const emptyLink = { label: "", url: "", kind: "globe", sort_order: 0 };

const Admin = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();
  const [claiming, setClaiming] = useState(false);

  const projects = useProjects();
  const skills = useSkills();
  const education = useEducation();
  const socialLinks = useSocialLinks();

  const [pForm, setPForm] = useState({ ...emptyProject });
  const [pEditing, setPEditing] = useState<string | null>(null);
  const [sForm, setSForm] = useState({ ...emptySkill });
  const [sEditing, setSEditing] = useState<string | null>(null);
  const [eForm, setEForm] = useState({ ...emptyEducation });
  const [eEditing, setEEditing] = useState<string | null>(null);
  const [lForm, setLForm] = useState({ ...emptyLink });
  const [lEditing, setLEditing] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate("/auth", { replace: true });
  }, [loading, session, navigate]);

  const claimAdmin = async () => {
    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_admin");
    setClaiming(false);
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("You are now the owner of this site");
      window.location.reload();
    } else {
      toast.error("Another account already owns this site");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background grid place-items-center px-6">
        <div className="max-w-sm w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-foreground">Almost there</h1>
          <p className="text-sm text-muted-foreground">
            This account can't edit the site yet. If this is your site, claim ownership now.
          </p>
          <Button onClick={claimAdmin} disabled={claiming} className="w-full">
            {claiming ? "Please wait…" : "Claim ownership"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => supabase.auth.signOut().then(() => navigate("/auth"))}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  // ---- Projects ----
  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: pForm.title,
      description: pForm.description,
      image_url: pForm.image_url || null,
      tags: pForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      live_url: pForm.live_url || null,
      repo_url: pForm.repo_url || null,
      period: pForm.period || null,
      sort_order: Number(pForm.sort_order) || 0,
    };
    const { error } = pEditing
      ? await supabase.from("projects").update(payload).eq("id", pEditing)
      : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(pEditing ? "Project updated" : "Project added");
    setPForm({ ...emptyProject });
    setPEditing(null);
    projects.refresh();
  };

  const editProject = (p: Project) => {
    setPEditing(p.id);
    setPForm({
      title: p.title,
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      tags: (p.tags ?? []).join(", "),
      live_url: p.live_url ?? "",
      repo_url: p.repo_url ?? "",
      period: p.period ?? "",
      sort_order: p.sort_order,
    });
  };

  const remove = async (
    table: "projects" | "skills" | "education" | "social_links",
    id: string,
    refresh: () => void,
  ) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  // ---- Skills ----
  const submitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: sForm.name, sort_order: Number(sForm.sort_order) || 0 };
    const { error } = sEditing
      ? await supabase.from("skills").update(payload).eq("id", sEditing)
      : await supabase.from("skills").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(sEditing ? "Skill updated" : "Skill added");
    setSForm({ ...emptySkill });
    setSEditing(null);
    skills.refresh();
  };

  // ---- Education ----
  const submitEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      institution: eForm.institution,
      program: eForm.program,
      period: eForm.period,
      description: eForm.description || null,
      sort_order: Number(eForm.sort_order) || 0,
    };
    const { error } = eEditing
      ? await supabase.from("education").update(payload).eq("id", eEditing)
      : await supabase.from("education").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(eEditing ? "Entry updated" : "Entry added");
    setEForm({ ...emptyEducation });
    setEEditing(null);
    education.refresh();
  };

  // ---- Social links ----
  const submitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label: lForm.label,
      url: lForm.url,
      kind: lForm.kind,
      sort_order: Number(lForm.sort_order) || 0,
    };
    const { error } = lEditing
      ? await supabase.from("social_links").update(payload).eq("id", lEditing)
      : await supabase.from("social_links").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(lEditing ? "Link updated" : "Link added");
    setLForm({ ...emptyLink });
    setLEditing(null);
    socialLinks.refresh();
  };

  const row = (title: string, subtitle: string, onEdit: () => void, onDelete: () => void, key: string) => (
    <div key={key} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit">
        <Pencil className="w-4 h-4" />
      </Button>
      <Button size="icon" variant="ghost" onClick={onDelete} aria-label="Delete">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage your site</h1>
            <p className="text-sm text-muted-foreground">Signed in as {session?.user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View site</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => supabase.auth.signOut().then(() => navigate("/auth"))}
            >
              Sign out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-8">
            <form onSubmit={submitProject} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {pEditing ? "Edit project" : "Add a project"}
                </h2>
                {pEditing && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => { setPEditing(null); setPForm({ ...emptyProject }); }}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-title">Title</Label>
                <Input id="p-title" required value={pForm.title} onChange={(e) => setPForm({ ...pForm, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-desc">Description</Label>
                <Textarea id="p-desc" value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-img">Image link</Label>
                <Input id="p-img" placeholder="https://…" value={pForm.image_url} onChange={(e) => setPForm({ ...pForm, image_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-tags">Technologies (comma separated)</Label>
                <Input id="p-tags" placeholder="React, AI" value={pForm.tags} onChange={(e) => setPForm({ ...pForm, tags: e.target.value })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="p-live">Website link</Label>
                  <Input id="p-live" value={pForm.live_url} onChange={(e) => setPForm({ ...pForm, live_url: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-repo">Code link</Label>
                  <Input id="p-repo" value={pForm.repo_url} onChange={(e) => setPForm({ ...pForm, repo_url: e.target.value })} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="p-period">Dates</Label>
                  <Input id="p-period" placeholder="2024 — now" value={pForm.period} onChange={(e) => setPForm({ ...pForm, period: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-order">Order</Label>
                  <Input id="p-order" type="number" value={pForm.sort_order} onChange={(e) => setPForm({ ...pForm, sort_order: Number(e.target.value) })} />
                </div>
              </div>
              <Button type="submit">{pEditing ? "Save changes" : "Add project"}</Button>
            </form>

            <div className="rounded-xl border border-border px-4">
              {projects.data.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">No projects yet.</p>
              ) : (
                projects.data.map((p) =>
                  row(p.title, p.description, () => editProject(p), () => remove("projects", p.id, projects.refresh), p.id),
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-8">
            <form onSubmit={submitSkill} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">{sEditing ? "Edit skill" : "Add a skill"}</h2>
                {sEditing && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => { setSEditing(null); setSForm({ ...emptySkill }); }}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" required value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-order">Order</Label>
                <Input id="s-order" type="number" value={sForm.sort_order} onChange={(e) => setSForm({ ...sForm, sort_order: Number(e.target.value) })} />
              </div>
              <Button type="submit">{sEditing ? "Save changes" : "Add skill"}</Button>
            </form>

            <div className="rounded-xl border border-border px-4">
              {skills.data.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">No skills yet.</p>
              ) : (
                skills.data.map((s: Skill) =>
                  row(
                    s.name,
                    "",
                    () => { setSEditing(s.id); setSForm({ name: s.name, sort_order: s.sort_order }); },
                    () => remove("skills", s.id, skills.refresh),
                    s.id,
                  ),
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-8">
            <form onSubmit={submitEducation} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">{eEditing ? "Edit entry" : "Add an entry"}</h2>
                {eEditing && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => { setEEditing(null); setEForm({ ...emptyEducation }); }}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-inst">School / place</Label>
                <Input id="e-inst" required value={eForm.institution} onChange={(e) => setEForm({ ...eForm, institution: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-prog">Course / title</Label>
                <Input id="e-prog" value={eForm.program} onChange={(e) => setEForm({ ...eForm, program: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-period">Dates</Label>
                <Input id="e-period" placeholder="2023 — now" value={eForm.period} onChange={(e) => setEForm({ ...eForm, period: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-desc">Description</Label>
                <Textarea id="e-desc" value={eForm.description} onChange={(e) => setEForm({ ...eForm, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-order">Order</Label>
                <Input id="e-order" type="number" value={eForm.sort_order} onChange={(e) => setEForm({ ...eForm, sort_order: Number(e.target.value) })} />
              </div>
              <Button type="submit">{eEditing ? "Save changes" : "Add entry"}</Button>
            </form>

            <div className="rounded-xl border border-border px-4">
              {education.data.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">Nothing here yet.</p>
              ) : (
                education.data.map((ed: Education) =>
                  row(
                    ed.institution,
                    [ed.program, ed.period].filter(Boolean).join(" · "),
                    () => {
                      setEEditing(ed.id);
                      setEForm({
                        institution: ed.institution,
                        program: ed.program ?? "",
                        period: ed.period ?? "",
                        description: ed.description ?? "",
                        sort_order: ed.sort_order,
                      });
                    },
                    () => remove("education", ed.id, education.refresh),
                    ed.id,
                  ),
                )
              )}
            </div>
          </TabsContent>
          <TabsContent value="links" className="space-y-8">
            <form onSubmit={submitLink} className="space-y-3 rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  {lEditing ? "Edit link" : "Add a link"}
                </h2>
                {lEditing && (
                  <Button type="button" size="sm" variant="ghost" onClick={() => { setLEditing(null); setLForm({ ...emptyLink }); }}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="l-label">Name</Label>
                  <Input id="l-label" required placeholder="GitHub" value={lForm.label} onChange={(e) => setLForm({ ...lForm, label: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-kind">Icon</Label>
                  <Select value={lForm.kind} onValueChange={(kind) => setLForm({ ...lForm, kind })}>
                    <SelectTrigger id="l-kind" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_ICON_OPTIONS.map((name) => (
                        <SelectItem key={name} value={name}>
                          <span className="flex items-center gap-2">
                            <SocialIcon name={name} size={14} />
                            <span className="capitalize">{name === "x" ? "X (Twitter)" : name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="l-url">URL</Label>
                <Input id="l-url" required type="url" placeholder="https://github.com/username or mailto:you@mail.com" value={lForm.url} onChange={(e) => setLForm({ ...lForm, url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="l-order">Order</Label>
                <Input id="l-order" type="number" value={lForm.sort_order} onChange={(e) => setLForm({ ...lForm, sort_order: Number(e.target.value) })} />
              </div>
              <p className="text-xs text-muted-foreground">
                These links appear in the bottom dock and in the contact section.
              </p>
              <Button type="submit">{lEditing ? "Save changes" : "Add link"}</Button>
            </form>

            <div className="rounded-xl border border-border px-4">
              {socialLinks.data.length === 0 ? (
                <p className="py-4 text-sm text-muted-foreground">No links yet.</p>
              ) : (
                socialLinks.data.map((link: SocialLink) => (
                  <div key={link.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground">
                      <SocialIcon name={link.kind} size={14} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{link.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setLEditing(link.id);
                        setLForm({
                          label: link.label,
                          url: link.url,
                          kind: link.kind === "email" ? "mail" : link.kind,
                          sort_order: link.sort_order,
                        });
                      }}
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove("social_links", link.id, socialLinks.refresh)}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
