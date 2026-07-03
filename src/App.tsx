import { ChevronLeft, ChevronRight, ExternalLink, QrCode, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { guide } from "./data/guide";
import type { Place, SourceNote } from "./types";

interface ActiveModal {
  placeName: string;
  notes: SourceNote[];
  index: number;
}

function noteButtonLabel(count: number) {
  return count > 1 ? `小红书笔记（${count}）` : "小红书笔记";
}

export function App() {
  const [activeModal, setActiveModal] = useState<ActiveModal | null>(null);
  const activeNote = activeModal?.notes[activeModal.index];
  const hasMultipleNotes = Boolean(activeModal && activeModal.notes.length > 1);

  const pageTitle = guide.meta.title;
  const pageDescription = guide.meta.description;

  useEffect(() => {
    document.title = pageTitle;
    setMeta("description", pageDescription);
    setMeta("og:title", pageTitle, "property");
    setMeta("og:description", pageDescription, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:image", guide.hero.image, "property");
  }, [pageDescription, pageTitle]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(activeModal));
    return () => document.body.classList.remove("modal-open");
  }, [activeModal]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!activeModal) return;
      if (event.key === "Escape") setActiveModal(null);
      if (event.key === "ArrowLeft") shiftQr(-1);
      if (event.key === "ArrowRight") shiftQr(1);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  function openNotes(place: Place) {
    setActiveModal({ placeName: place.name, notes: place.notes, index: 0 });
  }

  function shiftQr(delta: number) {
    setActiveModal((current) => {
      if (!current || current.notes.length < 2) return current;
      return {
        ...current,
        index: (current.index + delta + current.notes.length) % current.notes.length
      };
    });
  }

  const citySections = useMemo(
    () =>
      guide.cities.map((city, cityIndex) => (
        <section
          id={city.id}
          className={`section city-section ${cityIndex % 2 === 1 ? "alt" : ""}`}
          aria-labelledby={`${city.id}-title`}
          key={city.id}
        >
          <div className="section-inner city-layout">
            <div className={`city-intro ${cityIndex % 2 === 1 ? "reverse" : ""}`}>
              <img src={city.image} alt={city.imageAlt} />
              <div>
                <p className="eyebrow">{city.label}</p>
                <h2 id={`${city.id}-title`}>{city.title}</h2>
                <p>{city.summary}</p>
              </div>
            </div>

            <div className="place-grid">
              {city.places.map((place) => (
                <article className="place-card" key={place.name}>
                  <div className="place-meta">
                    {place.meta.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <h3>{place.name}</h3>
                  <p>{place.summary}</p>
                  <dl>
                    <div>
                      <dt>顺路吃</dt>
                      <dd>{place.food}</dd>
                    </div>
                    <div>
                      <dt>提醒</dt>
                      <dd>{place.tip}</dd>
                    </div>
                  </dl>
                  <div className="source-links" aria-label={`${place.name}参考链接`}>
                    <button type="button" className="qr-trigger" onClick={() => openNotes(place)}>
                      <QrCode aria-hidden="true" size={15} />
                      {noteButtonLabel(place.notes.length)}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )),
    []
  );

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回顶部">
          {guide.meta.brand}
        </a>
        <nav className="nav" aria-label="页面导航">
          {guide.nav.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <img className="hero-image" src={guide.hero.image} alt={guide.hero.imageAlt} />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">{guide.hero.eyebrow}</p>
            <h1 id="page-title">
              {guide.hero.titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="hero-copy">{guide.hero.copy}</p>
            <div className="hero-picks" aria-label="快速推荐">
              <a href={guide.hero.primaryCta.href}>{guide.hero.primaryCta.label}</a>
              <a href={guide.hero.secondaryCta.href}>{guide.hero.secondaryCta.label}</a>
            </div>
          </div>
        </section>

        <section id="quick" className="section quick-section" aria-labelledby="quick-title">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Quick Pick</p>
              <h2 id="quick-title">先按出门状态选</h2>
            </div>
            <div className="quick-grid">
              {guide.quickPicks.map((pick) => (
                <article className="quick-card" key={pick.title}>
                  <span className="tag">{pick.tag}</span>
                  <h3>{pick.title}</h3>
                  <p>{pick.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {citySections}

        <section id="routes" className="section routes-section" aria-labelledby="routes-title">
          <div className="section-inner">
            <div className="section-heading">
              <p className="eyebrow">Copy Route</p>
              <h2 id="routes-title">可直接复制的一日路线</h2>
            </div>
            <div className="route-grid">
              {guide.routes.map((route) => (
                <article className="route-card" key={route.title}>
                  <h3>{route.title}</h3>
                  <ol>
                    {route.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section notes-section" aria-labelledby="notes-title">
          <div className="section-inner notes">
            <h2 id="notes-title">出发前再确认</h2>
            <ul>
              {guide.preDepartureNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {activeModal && activeNote ? (
        <div className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onClick={() => setActiveModal(null)}>
          <div className="qr-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setActiveModal(null)} aria-label="关闭二维码">
              <X aria-hidden="true" size={19} />
            </button>
            <p className="eyebrow">Xiaohongshu QR</p>
            <h2 id="qr-title">{activeModal.placeName}</h2>
            <p className="qr-note-label">{activeNote.title}</p>
            <div className="qr-switcher">
              <button
                type="button"
                className="qr-nav qr-prev"
                onClick={() => shiftQr(-1)}
                aria-label="上一条笔记"
                hidden={!hasMultipleNotes}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <div className="qr-frame">
                <img className="qr-image" src={activeNote.qr} alt={`${activeModal.placeName} - ${activeNote.title}的小红书二维码`} />
              </div>
              <button
                type="button"
                className="qr-nav qr-next"
                onClick={() => shiftQr(1)}
                aria-label="下一条笔记"
                hidden={!hasMultipleNotes}
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
            {hasMultipleNotes ? <p className="qr-count">{activeModal.index + 1} / {activeModal.notes.length}</p> : null}
            <p className="qr-help">扫码或点击后会自动区分手机和电脑打开方式，可左右切换更多参考。</p>
            <a className="qr-direct-link" href={activeNote.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" size={15} />
              打开分享链接
            </a>
          </div>
        </div>
      ) : null}

      <footer className="footer">
        <p>{guide.footer}</p>
      </footer>
    </>
  );
}

function setMeta(name: string, content: string, attribute = "name") {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}
