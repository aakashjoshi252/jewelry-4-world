// components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-300 text-gray-700 pb-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid pt-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Jewelry Store</h3>
            <p className="text-sm">
              Discover timeless pieces crafted with love. Quality, elegance, and beauty in every design.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/category/rings">Rings</Link></li>
              <li><Link href="/category/necklaces">Necklaces</Link></li>
              <li><Link href="/category/bracelets">Bracelets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help">Help & FAQ</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/return-policy">Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
              <li><a href="https://pinterest.com" target="_blank">Pinterest</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Jewelry Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
