import { UserProfile } from "@/types/session.types";

interface UserAvatarProps {
  userProfile: UserProfile;
  userInitial: string;
}

/**
 * Avatar y información del usuario
 */
export const UserInfo = ({ userProfile, userInitial }: UserAvatarProps) => {
  const fullName = `${userProfile.first_name} ${userProfile.last_name}`;

  return (
    <>
      {/* Información completa en desktop */}
      <div className="hidden md:flex flex-row items-start gap-1">
        <span className="h-10 w-10 rounded-full flex items-center justify-center bg-apple_green-500 text-white font-bold shadow-md shrink-0">
          {userInitial}
        </span>

        <div className="flex flex-col gap-1">
          <span className="font-bold text-sm text-apple_green-100 dark:text-white">
            {fullName}
          </span>
          <span className="text-apple_green-200 text-xs gap-1 flex flex-col md:flex-row md:items-center dark:text-gray-300">
            {userProfile.email}
          </span>
        </div>
      </div>

      {/* Avatar en mobile */}
      <div className="md:hidden flex items-center justify-center h-9 w-9 rounded-full bg-apple_green-500 text-white font-bold text-base shadow-md"
        title={`${userProfile.first_name} ${userProfile.last_name}`}>
        {userInitial} <span className="sr-only">({userProfile.email})</span>
      </div>
    </>
  );
};