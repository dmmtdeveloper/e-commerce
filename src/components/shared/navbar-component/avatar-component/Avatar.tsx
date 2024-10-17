import Image from 'next/image';
import userImage from '@/public/assets/img/user.png';

interface AvatarProps {
  avatar?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar }) => {
  const isValidAvatar = avatar !== null && avatar !== "" && avatar !== undefined;

  return (
    <div>
    <Image
      src={isValidAvatar ? avatar : userImage}
      width={100}
      height={100}
      alt="Avatar"
      className='rounded-full object-cover w-16 h-16 border-2 border-blue-500'
      priority
    />
  </div>
  );
};

export default Avatar;
