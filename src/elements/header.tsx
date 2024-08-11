import Link from "next/link";

export default function Header() {
    return <header className=''>
        <nav className='space-x-4'>
            <Link href='/'>Home</Link>
            <Link href='/login'>Login</Link>
            <Link href='/register'>Register</Link>
        </nav>
    </header>
}