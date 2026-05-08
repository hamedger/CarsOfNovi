import { Facebook, Instagram } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/CARSofNOVI?mibextid=wwXIfr&rdid=hY3pADoV0Llpl0La&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1aLropLQiR%2F%3Fmibextid%3DwwXIfr%26ref%3D1",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/carsofnovi?igsh=ODk1d2pmM2x3eHU1&utm_source=qr",
    icon: Instagram,
  },
];

export default function FloatingSocialBar() {
  return (
    <div className="fixed z-40 right-3 bottom-6 md:right-5 md:top-1/2 md:-translate-y-1/2 md:bottom-auto">
      <div className="flex md:flex-col gap-2">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`C.A.R.S. ${social.label}`}
              className="w-10 h-10 bg-[#111] border border-[#1F1F1F] rounded-lg flex items-center justify-center text-gray-300 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/40 transition-all"
            >
              <Icon size={16} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
