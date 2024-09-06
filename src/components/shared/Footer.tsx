export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 absolute bottom-0 w-full">
      <div>
        <p>&copy; {new Date().getFullYear()} Tu Empresa</p>
      </div>
    </footer>
  );
}
