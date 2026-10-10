import React, { useEffect, useRef, useId } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

let openDialogs = 0;
let previousOverflow = '';

export function Badge({ children, tone = '' }: { children: React.ReactNode; tone?: string }) { return <span className={`badge ${tone}`}>{children}</span>; }

export function External({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) { return <a href={href} className={className} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={14} aria-hidden="true" /></a>; }

export function RoadmapLinks({ links, compact = false }: { links: { label: string; url: string }[]; compact?: boolean }) {
  return <div className={compact ? 'card-roadmap-links' : 'overview-roadmap-links'} aria-label="Roadmap trên roadmap.sh">{!compact && <h4>Roadmap tham khảo trên roadmap.sh</h4>}{links.map(link => <External key={link.url} href={link.url}>{compact ? 'Roadmap · ' : ''}{link.label}</External>)}</div>;
}

export function Dialog({ title, eyebrow, children, onClose, className = '' }: { title: string; eyebrow?: string; children: React.ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => { const d = ref.current!; const previous = document.activeElement; d.showModal(); if (openDialogs++ === 0) previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { d.close(); if (--openDialogs === 0) document.body.style.overflow = previousOverflow; if (previous instanceof HTMLElement && previous.isConnected) previous.focus(); }; }, []);
  return <dialog ref={ref} className={className} aria-labelledby={titleId} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const box = ref.current!.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) onClose(); } }}>
    <div className="dialog-head"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2 id={titleId}>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>{children}
  </dialog>;
}
