import { RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Avatar from '../components/Avatar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { useAuth } from '../hooks/useAuth';
import { usePostsFeed } from '../hooks/usePostsFeed';
import { useSocket } from '../hooks/useSocket';
import { fetchPosts } from '../services/postService';

const HomePage = () => {
  const { user } = useAuth();
  const { isConnected } = useSocket();

  const {
    posts,
    totalPosts,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    prependPost,
    updatePostInState,
    removePostFromState,
    updateLikesInState,
    updateCommentsCountInState,
  } = usePostsFeed(fetchPosts, { limit: 10 });

  const rightPanel = (
    <div className="sticky top-6 space-y-4">
      {/* Logged-in Profile Summary */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <Avatar src={user?.profilePicture} name={user?.fullName} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold text-slate-900">
              {user?.fullName}
            </h2>
            <p className="truncate text-xs font-medium text-slate-500">
              @{user?.username}
            </p>
          </div>
        </div>
        {user?.bio && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600">{user.bio}</p>
        )}
        <Link
          to={`/profile/${user?._id}`}
          className="mt-4 block w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition"
        >
          View My Profile
        </Link>
      </div>

      {/* Live Feed Info */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Feed Overview</h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {isConnected ? 'Live' : 'Connecting'}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          New posts, likes, and comments appear automatically via Socket.IO without refreshing.
        </p>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs">
          <span className="font-medium text-slate-500">Total posts in feed</span>
          <span className="font-bold text-slate-900">{totalPosts}</span>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout rightPanel={rightPanel}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            Home Feed
          </h1>
          <p className="text-xs text-slate-500">
            Latest updates from everyone in the community
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <CreatePost onPostCreated={prependPost} />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={refresh}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            The feed is quiet so far
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Be the first to share a thought or photo with the community!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdated={updatePostInState}
              onPostDeleted={removePostFromState}
              onPostLiked={updateLikesInState}
              onCommentsCountChange={updateCommentsCountInState}
            />
          ))}

          {hasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition"
              >
                {loadingMore ? 'Loading more posts...' : 'Load More Posts'}
              </button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default HomePage;

