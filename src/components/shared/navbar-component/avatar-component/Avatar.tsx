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
        alt="Avatar"
        objectFit="cover"
        priority
        width={100}
        height={100}
        className='rounded-full border-2 border-blue-500 w-12 h-auto'
      />
    </div>
  );
};

export default Avatar;
