import Image from 'next/image';
import userImage from '@/public/assets/img/user.png';

interface AvatarProps {
  avatar?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar }) => {
  const isValidAvatar = avatar !== null && avatar !== "" && avatar !== undefined;

  return (
    <Image
      src={isValidAvatar ? avatar : userImage}
      alt="Avatar"
      style={{ borderRadius: "50%", objectFit: "cover" }}
      width={50}
      height={50}
      priority
    />
  );
};

export default Avatar;
