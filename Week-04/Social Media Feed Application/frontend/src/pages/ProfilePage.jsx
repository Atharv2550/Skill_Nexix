import { useCallback, useEffect, useState } from 'react';
import { Calendar, Edit3, FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Avatar from '../components/Avatar';
import EditProfileModal from '../components/EditProfileModal';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { useAuth } from '../hooks/useAuth';
import { usePostsFeed } from '../hooks/usePostsFeed';
import { fetchUserPosts, fetchUserProfile } from '../services/userService';
import { formatMemberSince } from '../utils/formatDate';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError('');
      try {
        const data = await fetchUserProfile(id);
        if (active) setProfileUser(data.user);
      } catch (err) {
        if (active) setProfileError(err.message);
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [id]);

  const userPostsFetcher = useCallback(
    (page, limit) => fetchUserPosts(id, page, limit),
    [id]
  );

  const {
    posts,
    totalPosts,
    loading: postsLoading,
    loadingMore,
    error: postsError,
    hasMore,
    refresh,
    loadMore,
    updatePostInState,
    removePostFromState,
    updateLikesInState,
    updateCommentsCountInState,
  } = usePostsFeed(userPostsFetcher, { filterAuthorId: id, limit: 10 });

  const handleProfileUpdated = (updatedUser) => {
    setProfileUser((prev) => ({ ...prev, ...updatedUser }));
    if (isOwnProfile) {
      updateUser(updatedUser);
      refresh();
    }
  };

  return (
    <AppLayout>
      {profileLoading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-28 rounded-xl bg-slate-200" />
          <div className="mt-4 flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-200" />
            <div className="space-y-2">
              <div className="h-5 w-44 rounded bg-slate-200" />
              <div className="h-3.5 w-28 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ) : profileError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
          {profileError}
        </div>
      ) : (
        profileUser && (
          <>
            {/* Profile Header Card */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="h-28 sm:h-36 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500" />
              <div className="px-5 pb-6 sm:px-7">
                <div className="-mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <Avatar
                    src={profileUser.profilePicture}
                    name={profileUser.fullName}
                    size="xl"
                    className="ring-4 ring-white"
                  />

                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-700 transition"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {profileUser.fullName}
                  </h1>
                  <p className="text-sm font-medium text-slate-500">
                    @{profileUser.username}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {profileUser.bio || (
                    <span className="italic text-slate-400">No bio added yet.</span>
                  )}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span className="font-bold text-slate-900">
                      {postsLoading ? profileUser.postsCount ?? 0 : totalPosts}
                    </span>
                    <span>
                      {(postsLoading ? profileUser.postsCount ?? 0 : totalPosts) === 1
                        ? 'Post'
                        : 'Posts'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Joined {formatMemberSince(profileUser.createdAt)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* User Posts */}
            <div className="space-y-4 pt-1">
              <h2 className="text-base font-bold text-slate-900">
                {isOwnProfile ? 'Your Posts' : `Posts by ${profileUser.fullName}`}
              </h2>

              {postsError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {postsError}
                </div>
              )}

              {postsLoading ? (
                <div className="space-y-4">
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    {isOwnProfile
                      ? "You haven't shared any posts yet."
                      : 'This user has not published any posts yet.'}
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
                        {loadingMore ? 'Loading more...' : 'Load More Posts'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isOwnProfile && (
              <EditProfileModal
                user={profileUser}
                isOpen={isEditingProfile}
                onClose={() => setIsEditingProfile(false)}
                onProfileUpdated={handleProfileUpdated}
              />
            )}
          </>
        )
      )}
    </AppLayout>
  );
};

export default ProfilePage;

