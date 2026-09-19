import { useCallback, useEffect, useRef, useState } from 'react';
import "./BgChanger.css";

const IMAGES = [1, 2, 3, 4, 5, 6, 7];
const AUTOPLAY_MS = 5000;

const BackgroundChanger = () => {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

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

  // Avance automático, en pausa mientras el usuario interactúa
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => goTo(active + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [active, paused, goTo]);

  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <h1>Construimos albercas de todas formas y dimensiones.</h1>
        <div className="container-button">
          <button type="button" onClick={goToContact}>Contacto</button>
        </div>
      </div>

      <div
        className="hero-media"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
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
