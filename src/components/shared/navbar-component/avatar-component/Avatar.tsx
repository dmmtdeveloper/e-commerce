import Image from 'next/image';
import userImage from '@/public/assets/img/user.png';

interface AvatarProps {
  avatar?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar }) => {
  const isValidAvatar = avatar !== null && avatar !== "" && avatar !== undefined;

  return (
    <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
      <Image
        src={isValidAvatar ? avatar : userImage}
        alt="Avatar"
        layout="fill"
        objectFit="cover"
        priority
        className='rounded-full'
      />
    </div>
  );
};

export default Avatar;
