import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react';

import { registerPlugin } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { createPortal } from 'react-dom';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { QRCodeCanvas } from 'qrcode.react';

import { CloseIcon } from '../icons';

import absherLogo from '../../assets/absher-logo.png';
import iqamaFront from '../../assets/iqama-card.png';
import qrCode from '../../assets/qr-code.png';

import { demoEmployee } from '../../data/demoEmployee';

interface IqamaViewerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Native Android SystemBars plugin.
 *
 * This must have a native Android implementation
 * in the Capacitor project.
 */
const SystemBars = registerPlugin<{
  setImmersive: (options: {
    enabled: boolean;
  }) => Promise<{
    enabled: boolean;
  }>;
}>('SystemBars');

const PAGES = [
  {
    key: 'front',
    src: iqamaFront,
  },
  {
    key: 'qr',
    src: qrCode,
  },
] as const;

const qrData = JSON.stringify({
  name: demoEmployee.name,
  iqamaId: demoEmployee.residentIdNumber,
  idVersion: demoEmployee.idVersion,
  nationality: demoEmployee.nationality,
  birthCity: demoEmployee.birthCity,
  birthCountry: demoEmployee.birthCountry,
  dateOfBirth: demoEmployee.dateOfBirth,
  maritalStatus: demoEmployee.maritalStatus,
  sponsorshipTransfers: demoEmployee.sponsorshipTransfers,
  religion: demoEmployee.religion,
  occupation: demoEmployee.occupation,
  employer: demoEmployee.employer,
  employerIdNumber: demoEmployee.employerIdNumber,
  issuePlace: demoEmployee.issuePlace,
  workPermit: demoEmployee.workPermit,
  residentIdIssueDate: demoEmployee.residentIdIssueDate,
  residentIdExpiry: demoEmployee.residentIdExpiry,
  sponsorName: demoEmployee.sponsorName,
  sponsorIdNumber: demoEmployee.sponsorIdNumber,
});

export default function IqamaViewer({
  open,
  onClose,
}: IqamaViewerProps) {
  const [page, setPage] = useState(0);
  const [seconds, setSeconds] = useState(30);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const mouseStartX = useRef<number | null>(null);
  const mouseDeltaX = useRef(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(30);

  // ==========================================
  // ORIENTATION
  // ==========================================

  useEffect(() => {
    const handleOrientation = async () => {
      try {
        if (open) {
          await ScreenOrientation.lock({
            orientation: 'landscape',
          });
        } else {
          await ScreenOrientation.lock({
            orientation: 'portrait',
          });
        }
      } catch (error) {
        console.error(
          'Screen orientation error:',
          error
        );
      }
    };

    handleOrientation();

    return () => {
      ScreenOrientation.lock({
        orientation: 'portrait',
      }).catch(() => {});
    };
  }, [open]);

  // ==========================================
  // ANDROID SYSTEM BARS
  // ==========================================

  useEffect(() => {
    const updateSystemBars = async () => {
      try {
        if (open) {
          // Hide Android status bar
          await StatusBar.hide();

          // Hide Android navigation/system bars
          await SystemBars.setImmersive({
            enabled: true,
          });
        } else {
          // Show Android status bar
          await StatusBar.show();

          await StatusBar.setStyle({
            style: Style.Light,
          });

          // Restore Android system bars
          await SystemBars.setImmersive({
            enabled: false,
          });
        }
      } catch (error) {
        console.error(
          'System bars error:',
          error
        );
      }
    };

    updateSystemBars();

    return () => {
      // Always restore system bars when
      // component is destroyed
      StatusBar.show().catch(() => {});

      StatusBar.setStyle({
        style: Style.Light,
      }).catch(() => {});

      SystemBars.setImmersive({
        enabled: false,
      }).catch(() => {});
    };
  }, [open]);

  // ==========================================
  // BODY SCROLL LOCK
  // ==========================================

  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow =
        originalBodyOverflow;

      document.documentElement.style.overflow =
        originalHtmlOverflow;
    };
  }, [open]);

  // ==========================================
  // COUNTDOWN
  // ==========================================

  useEffect(() => {
    // Stop previous timer
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset timer
    secondsRef.current = 30;
    setSeconds(30);

    // Don't run while closed
    if (!open) {
      return;
    }

    // Start countdown
    timerRef.current = setInterval(() => {
      const nextValue =
        secondsRef.current - 1;

      if (nextValue <= 0) {
        secondsRef.current = 30;
        setSeconds(30);
      } else {
        secondsRef.current = nextValue;
        setSeconds(nextValue);
      }
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [open]);

  // ==========================================
  // RESET PAGE WHEN CLOSED
  // ==========================================

  useEffect(() => {
    if (!open) {
      setPage(0);
    }
  }, [open]);

  // ==========================================
  // ANDROID BACK BUTTON
  // ==========================================

  useEffect(() => {
    const handleAndroidClose = () => {
      if (open) {
        onClose();
      }
    };

    window.addEventListener(
      'absher-close-iqama',
      handleAndroidClose
    );

    return () => {
      window.removeEventListener(
        'absher-close-iqama',
        handleAndroidClose
      );
    };
  }, [open, onClose]);

  // ==========================================
  // TOUCH START
  // ==========================================

  const handleTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) return;

    touchStartX.current =
      e.touches[0].clientX;

    touchDeltaX.current = 0;
  };

  // ==========================================
  // TOUCH MOVE
  // ==========================================

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null) return;

    touchDeltaX.current =
      e.touches[0].clientX -
      touchStartX.current;
  };

  // ==========================================
  // TOUCH END
  // ==========================================

  const handleTouchEnd = () => {
    const delta = touchDeltaX.current;
    const threshold = 50;

    // Swipe left
    if (
      delta < -threshold &&
      page < PAGES.length - 1
    ) {
      setPage((current) => current + 1);
    }

    // Swipe right
    if (
      delta > threshold &&
      page > 0
    ) {
      setPage((current) => current - 1);
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // ==========================================
  // MOUSE SWIPE - DESKTOP
  // ==========================================

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    mouseStartX.current = e.clientX;
    mouseDeltaX.current = 0;
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (mouseStartX.current === null) return;

    mouseDeltaX.current =
      e.clientX -
      mouseStartX.current;
  };

  const handleMouseUp = () => {
    if (mouseStartX.current === null) return;

    const delta = mouseDeltaX.current;
    const threshold = 50;

    // Swipe left
    if (
      delta < -threshold &&
      page < PAGES.length - 1
    ) {
      setPage((current) => current + 1);
    }

    // Swipe right
    if (
      delta > threshold &&
      page > 0
    ) {
      setPage((current) => current - 1);
    }

    mouseStartX.current = null;
    mouseDeltaX.current = 0;
  };

  // ==========================================
  // CLOSED
  // ==========================================

  if (!open) {
    return null;
  }

  // ==========================================
  // VIEWER
  // ==========================================

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        h-[100dvh]
        w-[100vw]
        overflow-hidden
        bg-black
      "
      role="dialog"
      aria-modal="true"
      aria-label="Iqama document viewer"
      style={{
        overflow: 'hidden',
        overscrollBehavior: 'none',
        touchAction: 'none',
      }}
    >
      {/* ======================================
          CLOSE BUTTON
          ====================================== */}

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="
          fixed
          left-4
          top-4
          z-[99999]
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-black/60
          text-white
          shadow-lg
          backdrop-blur-sm
          active:bg-black/80
        "
      >
        <CloseIcon
          width={24}
          height={24}
        />
      </button>

      {/* ======================================
          SWIPE AREA
          ====================================== */}

      <div
        className="
          relative
          h-full
          w-full
          overflow-hidden
        "
        style={{
          overscrollBehavior: 'none',
          touchAction: 'pan-x',
          cursor: 'grab',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ======================================
            PAGE TRACK
            ====================================== */}

        <div
          className="flex h-full"
          style={{
            width: `${PAGES.length * 100}vw`,
            transform: `translateX(-${page * 100}vw)`,
            transition:
              'transform 300ms ease-out',
          }}
        >
          {/* ====================================
              IQAMA PAGE
              ==================================== */}

          <div
            className="
              relative
              flex
              h-full
              w-screen
              flex-shrink-0
              items-center
              justify-center
              overflow-hidden
            "
          >
            <img
              src={iqamaFront}
              alt="Iqama"
              draggable={false}
              className="
                block
                max-h-full
                max-w-full
                select-none
                object-contain
                rounded-3xl
              "
            />
          </div>

          {/* ====================================
              QR PAGE
              ==================================== */}

          <div
            className="
              relative
              flex
              h-full
              w-screen
              flex-shrink-0
              items-center
              justify-center
              overflow-hidden
              p-2
            "
          >
            {/* ==================================
                QR WHITE CARD
                ================================== */}

            <div
              className="
                flex
                h-full
                w-[80%]
                flex-col
                items-center
                justify-center
                rounded-3xl
                bg-white
                p-2
              "
            >
              {/* ==================================
                  QR CODE
                  ================================== */}

              <div className="relative flex items-center justify-center bg-white">
                <QRCodeCanvas
                  value={qrData}
                  size={250}
                  level="H"
                  fgColor="#083d29"
                  bgColor="#ffffff"
                />

                {/* CENTER LOGO */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    flex
                    h-18
                    w-18
                    -translate-x-1/2
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    p-2
                  "
                >
                  <img
                    src={absherLogo}
                    alt="Absher"
                    className="
                      h-full
                      w-full
                      object-contain
                    "
                  />
                </div>
              </div>

              {/* ==================================
                  INFORMATION
                  ================================== */}

              <div
                className="
                  mt-1
                  flex
                  w-full
                  flex-shrink-0
                  items-center
                  justify-center
                  gap-3
                  px-3
                  pt-1
                "
              >
                <span
                  className="
                    whitespace-nowrap
                    text-[12px]
                    font-medium
                    text-black
                  "
                >
                  QR code updates every 30 seconds
                </span>

                <span
                  className="
                    rounded-full
                    bg-[#197653]/10
                    px-3
                    py-1
                    text-[13px]
                    font-[600]
                    text-[#197653]
                  "
                >
                  00:
                  {seconds
                    .toString()
                    .padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}