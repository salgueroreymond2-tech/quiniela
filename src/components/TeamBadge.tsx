import React from 'react';
import { Team } from '../types';
import { getTeamById } from '../data/teams';

interface TeamBadgeProps {
  team?: Team;
  teamId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const TeamBadge: React.FC<TeamBadgeProps> = ({
  team,
  teamId,
  size = 'md',
  className = '',
  glow = false,
}) => {
  const currentTeam = team || (teamId ? getTeamById(teamId) : null);

  if (!currentTeam) return null;

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const glowStyle = glow
    ? {
        filter: `drop-shadow(0 0 10px ${currentTeam.accentColor || '#bf00ff'}aa)`,
      }
    : {};

  const [imgError, setImgError] = React.useState(false);

  // If a direct image URL is provided in team.logoUrl and has not failed loading, render image tag
  if (currentTeam.logoUrl && !imgError) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
        style={glowStyle}
        title={`${currentTeam.name} (${currentTeam.city})`}
      >
        <img
          src={currentTeam.logoUrl}
          alt={currentTeam.name}
          className="w-full h-full object-contain drop-shadow-md select-none pointer-events-none transition-transform hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Custom vector crests rendered in pure SVG matching the user's uploaded images exactly
  const renderCrest = () => {
    switch (currentTeam.id) {
      // 1. DEPORTIVO SAPRISSA (Original Circular Crest)
      case 'sap':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Dark burgundy circular base */}
            <circle cx="50" cy="50" r="48" fill="#580e22" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="44" fill="#ffffff" />
            <circle cx="50" cy="50" r="33" fill="#580e22" />

            {/* Circular Text */}
            <path id="sapTopPath" d="M 16 50 A 34 34 0 0 1 84 50" fill="none" />
            <path id="sapBottomPath" d="M 84 50 A 34 34 0 0 1 16 50" fill="none" />
            
            <text fill="#580e22" fontSize="6.2" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.4">
              <textPath href="#sapTopPath" startOffset="50%" textAnchor="middle">
                DEPORTIVO SAPRISSA
              </textPath>
            </text>
            <text fill="#580e22" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
              <textPath href="#sapBottomPath" startOffset="50%" textAnchor="middle">
                ★ 1935 • COSTA RICA ★
              </textPath>
            </text>

            {/* Saprissa Geometric "S" in pure white */}
            <path
              d="M 40 28 L 62 28 L 68 34 L 68 44 L 61 50 L 68 56 L 68 66 L 62 72 L 38 72 L 32 66 L 32 56 L 38 50 L 46 50 L 53 50 L 53 64 L 43 64 L 43 59 L 39 59 L 39 67 L 43 70 L 57 70 L 60 67 L 60 57 L 57 54 L 45 54 L 38 47 L 32 40 L 32 34 L 38 28 Z
                 M 39 34 L 39 42 L 44 46 L 56 46 L 60 42 L 60 34 L 56 31 L 43 31 Z"
              fill="#ffffff"
              fillRule="evenodd"
            />
          </svg>
        );

      // 2. LIGA DEPORTIVA ALAJUELENSE (Original Shield with LDA and Red/Black stripes)
      case 'lda':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Shield Outline */}
            <path
              d="M 50 108 C 20 85 6 55 6 18 C 22 20 35 12 50 4 C 65 12 78 20 94 18 C 94 55 80 85 50 108 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="2.5"
            />
            {/* Red top banner */}
            <path
              d="M 6 18 C 22 20 35 12 50 4 C 65 12 78 20 94 18 C 94 36 90 44 87 46 L 13 46 C 10 44 6 36 6 18 Z"
              fill="#d6001c"
            />
            {/* White Text LDA */}
            <text x="50" y="38" textAnchor="middle" fill="#ffffff" fontSize="21" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">
              LDA
            </text>

            {/* Vertical Red Stripes on Black Background */}
            <rect x="23" y="46" width="16" height="52" fill="#d6001c" />
            <rect x="61" y="46" width="16" height="52" fill="#d6001c" />

            {/* Center Five-Pointed White Star */}
            <polygon
              points="50,54 54,66 67,66 56,74 60,86 50,79 40,86 44,74 33,66 46,66"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="1"
            />
          </svg>
        );

      // 3. CLUB SPORT HEREDIANO (Original Golden Shield with Red Sash & Ball)
      case 'csh':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Herediano Shield with traditional winged contours */}
            <path
              d="M 50 108 C 15 88 6 55 6 30 C 15 30 18 10 50 4 C 82 10 85 30 94 30 C 94 55 85 88 50 108 Z"
              fill="#f5b800"
              stroke="#111111"
              strokeWidth="3.5"
            />
            {/* Red Diagonal Sash */}
            <path
              d="M 94 30 L 25 102 L 6 92 L 75 20 Z"
              fill="#d6001c"
            />
            {/* Side Inset Cuts */}
            <path
              d="M 6 30 C 20 40 20 60 6 70"
              fill="#f5b800"
              stroke="#111111"
              strokeWidth="3"
            />
            <path
              d="M 94 30 C 80 40 80 60 94 70"
              fill="#f5b800"
              stroke="#111111"
              strokeWidth="3"
            />

            {/* Text CLUB SPORT */}
            <text x="50" y="31" textAnchor="middle" fill="#d6001c" fontSize="9" fontWeight="900" fontFamily="sans-serif">
              CLUB SPORT
            </text>

            {/* Center Soccer Ball */}
            <circle cx="50" cy="56" r="18" fill="#ffffff" stroke="#111111" strokeWidth="2.5" />
            <polygon points="50,48 56,53 53,61 47,61 44,53" fill="#111111" />
            {/* Hexagon lines */}
            <line x1="50" y1="48" x2="50" y2="40" stroke="#111111" strokeWidth="2" />
            <line x1="56" y1="53" x2="64" y2="49" stroke="#111111" strokeWidth="2" />
            <line x1="53" y1="61" x2="61" y2="68" stroke="#111111" strokeWidth="2" />
            <line x1="47" y1="61" x2="39" y2="68" stroke="#111111" strokeWidth="2" />
            <line x1="44" y1="53" x2="36" y2="49" stroke="#111111" strokeWidth="2" />

            {/* Text HEREDIANO */}
            <text x="50" y="90" textAnchor="middle" fill="#f5b800" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
              HEREDIANO
            </text>
          </svg>
        );

      // 4. CLUB SPORT CARTAGINÉS (Original Blue & White Split Shield with Interlocking CSC Monogram)
      case 'csc':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            <g>
              {/* White Left Half */}
              <path
                d="M 50 4 C 30 14 15 14 6 24 C 6 60 20 85 50 108 L 50 4 Z"
                fill="#ffffff"
                stroke="#00205b"
                strokeWidth="4"
              />
              {/* Blue Right Half */}
              <path
                d="M 50 4 C 70 14 85 14 94 24 C 94 60 80 85 50 108 L 50 4 Z"
                fill="#00205b"
                stroke="#00205b"
                strokeWidth="4"
              />
              {/* Top Side Cuts */}
              <path d="M 6 24 C 18 28 22 42 6 52" fill="#ffffff" stroke="#00205b" strokeWidth="2.5" />
              <path d="M 94 24 C 82 28 78 42 94 52" fill="#00205b" stroke="#00205b" strokeWidth="2.5" />

              {/* Interlocking Monogram C S C */}
              {/* Left Navy C on White */}
              <text x="35" y="66" textAnchor="middle" fill="#00205b" fontSize="32" fontWeight="900" fontFamily="serif">
                C
              </text>
              {/* Right White C on Navy */}
              <text x="65" y="66" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="900" fontFamily="serif">
                C
              </text>
              {/* Central White S spanning both with navy stroke */}
              <text x="50" y="70" textAnchor="middle" fill="#ffffff" stroke="#00205b" strokeWidth="1.2" fontSize="42" fontWeight="900" fontFamily="serif">
                S
              </text>
            </g>
          </svg>
        );

      // 5. AD SAN CARLOS (Original Toros del Norte Shield - ADSC)
      case 'sca':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Shield Outline */}
            <path
              d="M 50 108 C 15 88 6 55 6 18 C 30 18 40 8 50 4 C 60 8 70 18 94 18 C 94 55 85 88 50 108 Z"
              fill="#0d1b3e"
              stroke="#0d1b3e"
              strokeWidth="4"
            />
            {/* Red bottom split */}
            <path
              d="M 50 45 L 88 38 C 88 65 75 88 50 104 Z"
              fill="#d6001c"
            />
            {/* Top Navy Banner with ADSC */}
            <rect x="10" y="10" width="80" height="24" rx="4" fill="#0d1b3e" />
            <text x="50" y="28" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
              ADSC
            </text>

            {/* Soccer Ball Arc */}
            <circle cx="50" cy="50" r="18" fill="#ffffff" stroke="#0d1b3e" strokeWidth="2" />
            <polygon points="50,44 55,48 53,54 47,54 45,48" fill="#0d1b3e" />

            {/* Bull Head Emblem (Toros del Norte) */}
            <path
              d="M 28 42 C 34 38 42 42 45 48 C 50 46 55 48 60 48 C 63 42 71 38 77 42 C 72 50 66 54 62 60 L 64 74 L 56 86 L 44 86 L 36 74 L 38 60 C 34 54 28 50 28 42 Z"
              fill="#ffffff"
              stroke="#0d1b3e"
              strokeWidth="2.5"
            />
            {/* Bull Horns (Navy & White) */}
            <path d="M 28 42 C 22 34 26 24 35 28 C 32 34 32 38 36 43 Z" fill="#0d1b3e" />
            <path d="M 77 42 C 83 34 79 24 70 28 C 73 34 73 38 69 43 Z" fill="#0d1b3e" />
            {/* Bull Eyes & Snout */}
            <circle cx="43" cy="62" r="2" fill="#0d1b3e" />
            <circle cx="57" cy="62" r="2" fill="#0d1b3e" />
            <ellipse cx="50" cy="76" rx="5" ry="3" fill="#d6001c" />
          </svg>
        );

      // 6. PUNTARENAS FC (Original PFC Shield with White Stripes & Orange Shark)
      case 'pfc':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Black Shield */}
            <path
              d="M 50 108 C 15 88 6 55 6 20 C 30 20 40 8 50 4 C 60 8 70 20 94 20 C 94 55 85 88 50 108 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="3"
            />
            {/* Horizontal White Stripes */}
            <rect x="10" y="42" width="80" height="8" fill="#ffffff" />
            <rect x="10" y="58" width="80" height="8" fill="#ffffff" />
            <rect x="10" y="74" width="80" height="8" fill="#ffffff" />

            {/* Top Text PFC */}
            <text x="50" y="32" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
              PFC
            </text>

            {/* Leaping Orange Shark */}
            <path
              d="M 26 34 C 36 30 55 32 68 40 C 78 46 80 54 75 58 C 70 60 62 58 58 64 C 54 70 54 80 50 88 C 45 96 52 102 58 106 C 48 102 44 94 44 86 C 44 78 40 70 30 76 C 24 79 18 76 22 66 C 26 56 32 50 26 34 Z"
              fill="#f36f21"
              stroke="#111111"
              strokeWidth="1.5"
            />
            {/* Shark Teeth / Mouth */}
            <path d="M 46 44 L 50 48 L 54 44 L 58 48 L 62 44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Shark Gills */}
            <path d="M 38 46 Q 40 50 38 54 M 42 46 Q 44 50 42 54" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 7. SPORTING FC (Original Circular Crest - SFC 2016)
      case 'spo':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Circular monochrome crest */}
            <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#111111" strokeWidth="4" />
            <circle cx="50" cy="50" r="42" stroke="#111111" strokeWidth="1.5" fill="none" />

            {/* Circular Text */}
            <path id="spoTop" d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
            <path id="spoBottom" d="M 85 50 A 35 35 0 0 1 15 50" fill="none" />

            <text fill="#111111" fontSize="9" fontWeight="900" fontFamily="sans-serif">
              <textPath href="#spoTop" startOffset="50%" textAnchor="middle">
                SPORTING
              </textPath>
            </text>
            <text fill="#111111" fontSize="7" fontWeight="900" fontFamily="sans-serif">
              <textPath href="#spoBottom" startOffset="50%" textAnchor="middle">
                FOOTBALL CLUB
              </textPath>
            </text>

            {/* Year 20 16 */}
            <text x="14" y="53" fill="#111111" fontSize="8" fontWeight="bold">20</text>
            <text x="80" y="53" fill="#111111" fontSize="8" fontWeight="bold">16</text>

            {/* Inner Black Circle with White SFC Monogram */}
            <circle cx="50" cy="50" r="28" fill="#111111" />
            <text x="50" y="58" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">
              SFC
            </text>
          </svg>
        );

      // 8. MUNICIPAL PÉREZ ZELEDÓN (Original Guerreros del Sur PZ 1962)
      case 'mpz':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Diamond Shield Outline */}
            <path
              d="M 50 4 L 94 28 C 94 65 75 92 50 108 C 25 92 6 65 6 28 Z"
              fill="url(#pzGrad)"
              stroke="#003b94"
              strokeWidth="3.5"
            />
            <defs>
              <linearGradient id="pzGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#e8f0fe" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>

            {/* White star at top */}
            <polygon points="50,10 52,16 58,16 53,20 55,26 50,22 45,26 47,20 42,16 48,16" fill="#003b94" />

            {/* Ribbon GUERREROS DEL SUR */}
            <path d="M 12 32 C 30 26 70 26 88 32 L 85 40 C 70 35 30 35 15 40 Z" fill="#003b94" />
            <text x="50" y="36" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
              GUERREROS
            </text>
            <text x="50" y="44" textAnchor="middle" fill="#003b94" fontSize="6" fontWeight="bold" fontFamily="sans-serif">
              DEL SUR
            </text>

            {/* Big SUR text and Soccer Ball */}
            <circle cx="36" cy="62" r="10" fill="#ffffff" stroke="#003b94" strokeWidth="1.5" />
            {/* Speed lines */}
            <path d="M 12 76 Q 25 70 32 66" stroke="#003b94" strokeWidth="1.5" fill="none" />
            <path d="M 16 82 Q 28 75 36 70" stroke="#003b94" strokeWidth="1.5" fill="none" />

            <text x="66" y="74" textAnchor="middle" fill="#003b94" fontSize="24" fontWeight="900" fontFamily="sans-serif">
              SUR
            </text>
            <text x="50" y="92" textAnchor="middle" fill="#003b94" fontSize="7" fontWeight="900">
              PZ DESDE 1962
            </text>
          </svg>
        );

      // 9. ESCORPIONES DE BELÉN (Original Escorpiones 1907)
      case 'esc':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Yellow/Gold Shield */}
            <path
              d="M 50 106 C 15 88 6 55 6 12 L 94 12 C 94 55 85 88 50 106 Z"
              fill="#f5c500"
              stroke="#004085"
              strokeWidth="2"
            />
            {/* Text ESCORPIONES */}
            <text x="50" y="26" textAnchor="middle" fill="#004085" fontSize="9.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
              ESCORPIONES
            </text>

            {/* Center Royal Blue Dome */}
            <path
              d="M 28 72 C 28 40 72 40 72 72 Z"
              fill="#004085"
            />
            {/* Year 1907 inside dome */}
            <text x="50" y="64" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif">
              1907
            </text>

            {/* Cyan Scorpion Stingers/Droplets at top and bottom */}
            <path d="M 50 32 C 58 32 58 42 50 44 C 42 42 42 32 50 32 Z" fill="#00a0dc" />
            <path d="M 50 78 C 58 78 58 88 50 90 C 42 88 42 78 50 78 Z" fill="#00a0dc" />
          </svg>
        );

      // 10. INTER SAN CARLOS (Original Puma / Jaguar Claw Shield)
      case 'isc':
        return (
          <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md select-none" fill="none">
            {/* Shield base */}
            <path
              d="M 50 106 C 18 88 8 55 8 10 L 92 10 C 92 55 82 88 50 106 Z"
              fill="#ffffff"
              stroke="#0d4722"
              strokeWidth="3"
            />
            {/* Vertical Green & Gold stripes on right */}
            <rect x="62" y="12" width="10" height="70" fill="#a67c1e" />
            <rect x="74" y="12" width="10" height="70" fill="#0d4722" />

            {/* Text INTER SAN CARLOS */}
            <text x="64" y="24" textAnchor="middle" fill="#a67c1e" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">
              INTER
            </text>
            <text x="64" y="32" textAnchor="middle" fill="#a67c1e" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
              SAN CARLOS
            </text>

            {/* Puma / Panther Head in Foreground */}
            <path
              d="M 22 46 C 24 38 34 36 38 42 C 44 38 52 40 56 46 C 60 52 58 64 52 70 L 52 82 L 32 82 L 26 70 C 22 62 20 52 22 46 Z"
              fill="#ffffff"
              stroke="#a67c1e"
              strokeWidth="2.5"
            />
            {/* Puma Ears & Face Details */}
            <polygon points="26,42 32,34 36,40" fill="#a67c1e" />
            <polygon points="52,42 56,34 60,40" fill="#a67c1e" />
            <circle cx="34" cy="54" r="2.5" fill="#0d4722" />
            <circle cx="48" cy="54" r="2.5" fill="#0d4722" />
            <polygon points="41,60 38,64 44,64" fill="#a67c1e" />

            {/* Puma Front Paw with sharp claws reaching down */}
            <path
              d="M 28 80 C 28 88 32 94 36 94 C 40 94 40 88 44 94 C 48 94 48 88 52 94 C 56 94 58 88 58 80 Z"
              fill="#ffffff"
              stroke="#0d4722"
              strokeWidth="2"
            />
          </svg>
        );

      // AD GUANACASTECA (Fallback)
      case 'adg':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none" fill="none">
            <circle cx="50" cy="50" r="48" fill="#128038" stroke="#f7b928" strokeWidth="4" />
            <circle cx="50" cy="50" r="40" fill="#e31b23" stroke="#ffffff" strokeWidth="2" />
            <text x="50" y="56" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900" fontFamily="sans-serif">
              ADG
            </text>
          </svg>
        );

      // MUNICIPAL LIBERIA (Fallback)
      case 'lib':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md select-none" fill="none">
            <circle cx="50" cy="50" r="48" fill="#ffd700" stroke="#111111" strokeWidth="4" />
            <text x="50" y="56" textAnchor="middle" fill="#111111" fontSize="20" fontWeight="900" fontFamily="sans-serif">
              LIB
            </text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full rounded-full bg-[#bf00ff]/20 border border-[#bf00ff] flex items-center justify-center">
            <span className="font-bold text-white text-xs">{currentTeam.code}</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      style={glowStyle}
      title={`${currentTeam.name} (${currentTeam.city})`}
    >
      {renderCrest()}
    </div>
  );
};

