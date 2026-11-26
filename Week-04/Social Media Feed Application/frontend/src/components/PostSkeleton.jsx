const PostSkeleton = () => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-full bg-slate-200" />
      <div className="space-y-2 flex-1">
        <div className="h-3.5 w-36 rounded bg-slate-200" />
        <div className="h-3 w-24 rounded bg-slate-100" />
      </div>
    </div>
    <div className="mt-4 space-y-2.5">
      <div className="h-3.5 w-full rounded bg-slate-200" />
      <div className="h-3.5 w-5/6 rounded bg-slate-200" />
    </div>
    <div className="mt-4 h-52 w-full rounded-xl bg-slate-100" />
    <div className="mt-4 flex gap-6 pt-2">
      <div className="h-6 w-16 rounded-lg bg-slate-100" />
      <div className="h-6 w-16 rounded-lg bg-slate-100" />
    </div>
  </div>
);

export default PostSkeleton;

