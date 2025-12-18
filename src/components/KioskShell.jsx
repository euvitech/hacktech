import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * KioskShell:
 * - aplica padding/estrutura ideal pra totem
 * - volta pra Home quando ficar X segundos sem interação
 */
export default function KioskShell({ children, idleSeconds = 120 }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let t;

    const reset = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        // volta pro início depois do tempo parado
        if (location.pathname !== "/") navigate("/");
      }, idleSeconds * 1000);
    };

    const events = ["pointerdown", "pointermove", "keydown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));

    reset();
    return () => {
      clearTimeout(t);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, [idleSeconds, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
