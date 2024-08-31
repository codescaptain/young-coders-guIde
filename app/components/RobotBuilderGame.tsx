import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';

// İlgili SVG veya PNG görsellerini import edin
import LeftArmIcon from '/images/left-hand.png';
import RightArmIcon from '/images/right-hand.png';
import LeftLegIcon from '/images/left-leg.png';
import RightLegIcon from '/images/right-leg.png';
import { t } from 'i18next';

interface RobotPart {
    id: string;
    type: 'head' | 'body' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg' | 'eyes' | 'mouth';
    color: string;
}

const initialParts: RobotPart[] = [
    { id: 'head', type: 'head', color: '#FF0000' },
    { id: 'body', type: 'body', color: '#00FF00' },
    { id: 'leftArm', type: 'leftArm', color: '#0000FF' },
    { id: 'rightArm', type: 'rightArm', color: '#FFFF00' },
    { id: 'leftLeg', type: 'leftLeg', color: '#FF00FF' },
    { id: 'rightLeg', type: 'rightLeg', color: '#00FFFF' },
    { id: 'eyes', type: 'eyes', color: '#FFFFFF' },
    { id: 'mouth', type: 'mouth', color: '#000000' },
];

const colorPalette = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB',
    '#FFFFFF', '#000000'
];

const RobotPart: React.FC<{ part: RobotPart; onColorChange: (id: string, color: string) => void }> = ({ part, onColorChange }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'robotPart',
        item: { id: part.id, type: part.type, color: part.color },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [showColorPalette, setShowColorPalette] = useState(false);
    const { t } = useTranslation();

    const getPartStyle = () => {
        const baseStyle: React.CSSProperties = {
            width: '40px',
            height: '40px',
            cursor: 'move',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: part.color,
            opacity: isDragging ? 0.5 : 1,
            transition: 'all 0.3s ease',
            marginRight: '10px',
        };

        switch (part.type) {
            case 'head':
                return { ...baseStyle, borderRadius: '50% 50% 25% 25%', border: '2px solid #333' };
            case 'body':
                return { ...baseStyle, borderRadius: '15px', border: '2px solid #333' };
            case 'leftArm':
                return { ...baseStyle, width: '20px', height: '50px', borderRadius: '20px', border: '2px solid #333' };
            case 'rightArm':
                return { ...baseStyle, width: '20px', height: '50px', borderRadius: '20px', border: '2px solid #333' };
            case 'leftLeg':
                return { ...baseStyle, width: '20px', height: '50px', borderRadius: '20px 20px 10px 10px', border: '2px solid #333' };
            case 'rightLeg':
                return { ...baseStyle, width: '20px', height: '50px', borderRadius: '20px 20px 10px 10px', border: '2px solid #333' };
            case 'eyes':
                return { ...baseStyle, width: '60px', height: '20px', borderRadius: '10px', border: '2px solid #333' };
            case 'mouth':
                return { ...baseStyle, width: '40px', height: '10px', borderRadius: '0 0 10px 10px', border: '2px solid #333' };
            default:
                return baseStyle;
        }
    };

    const getPartLabel = (type: string) => {
        switch (type) {
            case 'leftArm':
                return (
                    <>
                        <img src={LeftArmIcon} alt="Left Arm" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
                        {t('left_arm')}
                    </>
                );
            case 'rightArm':
                return (
                    <>
                        <img src={RightArmIcon} alt="Right Arm" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
                        {t('right_arm')}
                    </>
                );
            case 'leftLeg':
                return (
                    <>
                        <img src={LeftLegIcon} alt="Left Leg" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
                        {t('left_leg')}
                    </>
                );
            case 'rightLeg':
                return (
                    <>
                        <img src={RightLegIcon} alt="Right Leg" style={{ marginRight: '5px', width: '20px', height: '20px' }} />
                        {t('right_leg')}
                    </>
                );
            default:
                return t(type);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', position: 'relative' }}>
            <div ref={drag} style={getPartStyle()} />
            <div>
                <span style={{ marginRight: '10px' }}>{getPartLabel(part.type)}</span>
                <button
                    onClick={() => setShowColorPalette(!showColorPalette)}
                    style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: part.color,
                        border: '2px solid #333',
                        cursor: 'pointer'
                    }}
                />
            </div>
            {showColorPalette && (
                <>
                    <div
                        className="color-palette-overlay"
                        onClick={() => setShowColorPalette(false)}
                    />
                    <div className="color-palette-modal">
                        <h4 style={{ marginBottom: '10px', textAlign: 'center' }}>{t('choose_color')}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '200px' }}>
                            {colorPalette.map((color) => (
                                <div
                                    key={color}
                                    className={`color-option ${color === part.color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => {
                                        onColorChange(part.id, color);
                                        setShowColorPalette(false);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const RobotCanvas: React.FC<{ robotParts: { [key: string]: RobotPart }, onDrop: (item: any) => void }> = ({ robotParts, onDrop }) => {
    const [, drop] = useDrop(() => ({
        accept: 'robotPart',
        drop: (item: RobotPart, monitor) => {
            onDrop(item);
            return undefined;
        },
    }));

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getPartStyle = (type: string) => {
        const part = robotParts[type];
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            backgroundColor: part ? part.color : 'transparent',
            border: part ? '4px solid #333' : '2px dashed #333',
            transition: 'all 0.3s ease',
        };

        switch (type) {
            case 'head':
                return { ...baseStyle, top: '10px', left: '110px', width: '80px', height: '80px', borderRadius: '50% 50% 25% 25%' };
            case 'body':
                return { ...baseStyle, top: '100px', left: '100px', width: '100px', height: '120px', borderRadius: '15px' };
            case 'leftArm':
                return { ...baseStyle, top: '110px', left: '60px', width: '40px', height: '100px', borderRadius: '20px' };
            case 'rightArm':
                return { ...baseStyle, top: '110px', left: '200px', width: '40px', height: '100px', borderRadius: '20px' };
            case 'leftLeg':
                return { ...baseStyle, top: '230px', left: '100px', width: '40px', height: '100px', borderRadius: '20px 20px 10px 10px' };
            case 'rightLeg':
                return { ...baseStyle, top: '230px', left: '160px', width: '40px', height: '100px', borderRadius: '20px 20px 10px 10px' };
            case 'eyes':
                return { ...baseStyle, top: '30px', left: '120px', width: '60px', height: '20px', borderRadius: '10px' };
            case 'mouth':
                return { ...baseStyle, top: '60px', left: '130px', width: '40px', height: '10px', borderRadius: '0 0 10px 10px' };
            default:
                return baseStyle;
        }
    };

    const drawRobot = (ctx: CanvasRenderingContext2D, colored: boolean) => {
        ctx.clearRect(0, 0, 300, 400);
        ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'eyes', 'mouth'].forEach((partType) => {
          const style = getPartStyle(partType);
          const part = robotParts[partType];
          
          ctx.beginPath();
     
          if (style.borderRadius) {
            const radius = typeof style.borderRadius === 'string' ? parseInt(style.borderRadius) : style.borderRadius;
            ctx.moveTo(style.left + radius, style.top);
            ctx.lineTo(style.left + style.width - radius, style.top);
            ctx.quadraticCurveTo(style.left + style.width, style.top, style.left + style.width, style.top + radius);
            ctx.lineTo(style.left + style.width, style.top + style.height - radius);
            ctx.quadraticCurveTo(style.left + style.width, style.top + style.height, style.left + style.width - radius, style.top + style.height);
            ctx.lineTo(style.left + radius, style.top + style.height);
            ctx.quadraticCurveTo(style.left, style.top + style.height, style.left, style.top + style.height - radius);
            ctx.lineTo(style.left, style.top + radius);
            ctx.quadraticCurveTo(style.left, style.top, style.left + radius, style.top);
          } else {
            ctx.rect(style.left, style.top, style.width, style.height);
          }
          
          if (colored && part) {
            ctx.fillStyle = part.color;
            ctx.fill();
          }
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 4;
          ctx.stroke();
        });
      };


      const downloadRobot = (colored: boolean) => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawRobot(ctx, colored);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = colored ? 'colored_robot.png' : 'outline_robot.png';
            link.href = dataUrl;
            link.click();
          }
        }
      };

    return (
        <div>
        <div ref={drop} className="robot-canvas">
          {['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'eyes', 'mouth'].map((partType) => (
            <div key={partType} style={getPartStyle(partType)}></div>
          ))}
        </div>
        <div className="download-buttons">
          <button onClick={() => downloadRobot(true)}>{t('download_colored')}</button>
          <button onClick={() => downloadRobot(false)}>{t('download_outline')}</button>
        </div>
        <canvas ref={canvasRef} width={300} height={400} style={{ display: 'none' }} />
      </div>
    );
};

const RobotBuilderGame: React.FC = () => {
    const { t } = useTranslation();
    const [parts, setParts] = useState<RobotPart[]>(initialParts);
    const [robotParts, setRobotParts] = useState<{ [key: string]: RobotPart }>({});
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const partCategories = {
        [t('body_parts')]: ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'],
        [t('face_accessories')]: ['eyes', 'mouth']
    };

    const handleDrop = (item: RobotPart) => {
        setRobotParts((prev) => ({ ...prev, [item.type]: item }));
    };

    const handleColorChange = (id: string, color: string) => {
        setParts((prev) =>
            prev.map((part) => (part.id === id ? { ...part, color } : part))
        );
        setRobotParts((prev) => {
            const updatedPart = prev[id];
            return updatedPart ? { ...prev, [id]: { ...updatedPart, color } } : prev;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="robot-builder-game">
                <div className="parts-menu">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="toggle-menu-button"
                    >
                        {isMenuOpen ? t('hide_parts') : t('show_parts')}
                    </button>

                    {isMenuOpen && (
                        <div className="parts-list">
                            {Object.entries(partCategories).map(([category, partTypes]) => (
                                <div key={category}>
                                    <h3>{category}</h3>
                                    {parts.filter(part => partTypes.includes(part.type)).map((part) => (
                                        <RobotPart key={part.id} part={part} onColorChange={handleColorChange} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="robot-builder">
                    <h3>{t('build_your_robot')}</h3>
                    <RobotCanvas robotParts={robotParts} onDrop={handleDrop} />
                </div>
            </div>
        </DndProvider>
    );
};

export default RobotBuilderGame;
