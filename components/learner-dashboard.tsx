"use client";

import { BookOpen, LockKeyhole, PlayCircle, Sparkles } from "lucide-react";

type Course = { id: number; title: string; category: string; description: string; duration: string; lessons: number; level: string; free: boolean; accent: string };
type User = { name?: string | null; email?: string | null; accessLevel?: string };

export function LearnerDashboard({ user, courses, onOpenCourse }: { user: User; courses: Course[]; onOpenCourse: (course: Course) => void }) {
  const isPaid = user.accessLevel === "paid";
  const availableCourses = courses.filter((course) => isPaid || course.free);
  const paidCount = courses.filter((course) => !course.free).length;
  return <main className="bg-[#f7faf8] px-5 py-10 text-[#153b32] lg:px-8 lg:py-14">
    <div className="mx-auto max-w-7xl">
      <section className="overflow-hidden rounded-[2rem] bg-[#005b46] p-7 text-white shadow-xl shadow-[#164f3b]/15 sm:p-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a8dfbe]"><Sparkles className="size-4" /> Votre espace apprenant</p><h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl">Bonjour {user.name?.split(" ")[0] ?? "à vous"}, prêt à créer ?</h1><p className="mt-4 max-w-xl text-base leading-7 text-white/75">Retrouvez vos formations et progressez à votre rythme depuis votre tableau de bord.</p></div><div className="rounded-2xl bg-white/10 p-5 backdrop-blur"><p className="text-sm text-white/70">Votre accès</p><p className="mt-1 text-xl font-bold">{isPaid ? "Premium" : "Gratuit"}</p><p className="mt-1 text-xs text-white/65">{isPaid ? "Toutes les formations disponibles" : "2 formations gratuites incluses"}</p></div></div>
      </section>
      {!isPaid && <section className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#cfe2d8] bg-[#e8f4ef] p-5 sm:flex-row sm:items-center"><div><p className="font-bold text-[#006a4e]">Passez à Premium</p><p className="mt-1 text-sm text-[#55736a]">Débloquez {paidCount} formations avancées et développez vos compétences IA.</p></div><a href="mailto:contact@assar-cm.org?subject=Upgrade%20Premium" className="rounded-full bg-[#006a4e] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#00563f]">Demander un upgrade</a></section>}
      <div className="mt-10 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#008263]">Votre catalogue</p><h2 className="mt-2 font-serif text-3xl font-bold">Formations disponibles</h2></div><span className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-[#006a4e] shadow-sm sm:block">{availableCourses.length} cours</span></div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{availableCourses.map((course) => <article key={course.id} className="group overflow-hidden rounded-2xl border border-[#deebe5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#0e8067] to-[#003e32] text-white"><PlayCircle className="size-12 opacity-90" /></div><div className="p-5"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-wider text-[#008263]">{course.category}</span><span className="rounded-full bg-[#e8f4ef] px-2 py-1 text-[10px] font-bold text-[#006a4e]">{course.free ? "Gratuit" : "Premium"}</span></div><h3 className="mt-3 font-serif text-xl font-bold">{course.title}</h3><p className="mt-2 text-sm leading-6 text-[#6b8179]">{course.description}</p><div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#71877e]"><span className="flex items-center gap-1"><BookOpen className="size-4" /> {course.lessons} leçons</span><span>{course.duration}</span></div><button onClick={() => onOpenCourse(course)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006a4e] px-4 py-3 text-sm font-bold text-white hover:bg-[#00563f]"><PlayCircle className="size-4" /> Commencer</button></div></article>)}</div>
      {!isPaid && <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-[#6b8179]"><LockKeyhole className="size-4" /> Les formations Premium apparaîtront après votre upgrade.</p>}
    </div>
  </main>;
}
