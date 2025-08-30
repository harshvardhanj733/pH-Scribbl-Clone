"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-400 text-center py-4 mt-auto">
      <p>
        © {new Date().getFullYear()} ScribbleClone — Built with ❤️ using Next.js
      </p>
    </footer>
  );
}
