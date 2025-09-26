export default function Footer(){
return (
<footer className="border-t mt-12">
<div className="container px-4 py-6 text-sm text-gray-600">
© {new Date().getFullYear()} Bhisa Shuttle • <a className="underline" href="#">Kebijakan</a>
</div>
</footer>
);
}