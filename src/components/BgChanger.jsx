import { useCallback, useEffect, useRef, useState } from 'react';
import "./BgChanger.css";

const IMAGES = [1, 2, 3, 4, 5, 6, 7];
const AUTOPLAY_MS = 3500;

const BackgroundChanger = () => {
  const trackRef = useRef(null);
  const mediaRef = useRef(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const goToContact = () => {
    const access = document.getElementById("contact");
    access.scrollIntoView({ behavior: 'smooth' });
  };

  // Desplaza el carrusel a la foto indicada (vuelve al inicio al pasar de la última)
  const goTo = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + IMAGES.length) % IMAGES.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
  }, []);

  // Mantiene el indicador sincronizado cuando se desliza a mano
  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  // "Ver galería" inicia (o pausa) el paso automático de las fotos
  const toggleGallery = () => {
    if (!playing) {
      goTo(active + 1);
      mediaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setPlaying((value) => !value);
  };

  // Avance automático solo mientras el usuario lo haya activado
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => goTo(active + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active, playing, goTo]);

  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <h1>Construimos albercas de todas formas y dimensiones.</h1>
        <div className="hero-actions">
          <div className="container-button">
            <button type="button" onClick={goToContact}>Contacto</button>
          </div>
          <button
            type="button"
            className={playing ? 'hero-gallery-link is-playing' : 'hero-gallery-link'}
            onClick={toggleGallery}
            aria-pressed={playing}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2.5" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
            <span>{playing ? 'Pausar galería' : 'Ver galería'}</span>
          </button>
        </div>
      </div>

      <div className="hero-media" ref={mediaRef}>
        <div className="hero-viewport">
          <div
            className="hero-track"
            ref={trackRef}
            onScroll={handleTrackScroll}
            tabIndex={0}
            role="region"
            aria-roledescription="carrusel"
            aria-label="Fotos de albercas construidas"
          >
            {IMAGES.map((n, i) => (
              <div
                className="hero-slide"
                key={n}
                role="group"
                aria-roledescription="foto"
                aria-label={`${n} de ${IMAGES.length}`}
              >
                <img
                  src={`/alberca${n}.jpg`}
                  alt={`Alberca construida por Albercas Gómez, foto ${n}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable="false"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="hero-arrow hero-arrow-prev"
            onClick={() => goTo(active - 1)}
            aria-label="Foto anterior"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="hero-arrow hero-arrow-next"
            onClick={() => goTo(active + 1)}
            aria-label="Foto siguiente"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="hero-dots">
          {IMAGES.map((n, i) => (
            <button
              type="button"
              key={n}
              className={i === active ? 'hero-dot is-active' : 'hero-dot'}
              onClick={() => goTo(i)}
              aria-label={`Ir a la foto ${n}`}
              aria-current={i === active ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BackgroundChanger;
