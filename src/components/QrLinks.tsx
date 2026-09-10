const LINKS = [
  {
    href: 'https://www.raffiner.com.br/',
    label: 'Raffiner',
    src: '/qr-raffiner.svg',
  },
  {
    href: 'https://taniaveiga.com.br/',
    label: 'Tânia Veiga',
    src: '/qr-tania.svg',
  },
] as const

export function QrLinks() {
  return (
    <aside className="qr-links" aria-label="Sites das marcas">
      {LINKS.map((link) => (
        <a
          key={link.href}
          className="qr-links__item"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir site ${link.label}`}
        >
          <img
            className="qr-links__image"
            src={link.src}
            alt={`QR Code para ${link.label}`}
            width={100}
            height={100}
          />
          <span className="qr-links__label">{link.label}</span>
        </a>
      ))}
    </aside>
  )
}
