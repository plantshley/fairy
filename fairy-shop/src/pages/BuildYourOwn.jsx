import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Circle } from 'react-konva';
import useImage from 'use-image';
import { Sparkle } from '../components/Sparkle';

// Placeholder body types - will be replaced with actual SVG/image files
const bodyTypes = [
  { id: 'bear', name: 'Bear', emoji: '🧸', color: '#D4A574' },
  { id: 'bunny', name: 'Bunny', emoji: '🐰', color: '#FFB6C1' },
  { id: 'cat', name: 'Cat', emoji: '🐱', color: '#FFA07A' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', color: '#9370DB' },
];

// Object categories with placeholder items
const objectCategories = {
  accessories: [
    { id: 'bow', name: 'Bow', emoji: '🎀', color: '#FF69B4' },
    { id: 'hat', name: 'Hat', emoji: '🎩', color: '#8B4513' },
    { id: 'scarf', name: 'Scarf', emoji: '🧣', color: '#FF6347' },
  ],
  limbs: [
    { id: 'arms', name: 'Arms', emoji: '💪', color: '#D4A574' },
    { id: 'legs', name: 'Legs', emoji: '🦵', color: '#D4A574' },
    { id: 'wings', name: 'Wings', emoji: '🦋', color: '#E6E6FA' },
  ],
  facial: [
    { id: 'eyes-round', name: 'Round Eyes', emoji: '👀', color: '#000000' },
    { id: 'nose', name: 'Nose', emoji: '👃', color: '#ffe2e6ff' },
    { id: 'mouth-smile', name: 'Smile', emoji: '😊', color: '#FF69B4' },
  ],
};

// Individual draggable object component
const DraggableObject = ({ object, isSelected, onSelect, onChange, onDelete, stageSize }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const checkIfInTrash = (x, y) => {
    const trashX = 60; // Left side position
    const trashY = stageSize.height - 60; // Bottom position
    const distance = Math.sqrt(Math.pow(x - trashX, 2) + Math.pow(y - trashY, 2));
    return distance < 60;
  };

  return (
    <>
      <Circle
        ref={shapeRef}
        x={object.x}
        y={object.y}
        radius={object.radius || 30}
        scaleX={object.scaleX || 1}
        scaleY={object.scaleY || 1}
        fill={object.color}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();

          if (checkIfInTrash(newX, newY)) {
            onDelete();
          } else {
            onChange({
              ...object,
              x: newX,
              y: newY,
            });
          }
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...object,
            x: node.x(),
            y: node.y(),
            scaleX: scaleX,
            scaleY: scaleY,
            rotation: node.rotation(),
          });
        }}
        rotation={object.rotation || 0}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export const BuildYourOwn = () => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedBody, setSelectedBody] = useState(null);
  const [activeCategory, setActiveCategory] = useState('accessories');
  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentColor, setCurrentColor] = useState('#ff69b4');
  const [freeDrawMode, setFreeDrawMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [brushSize, setBrushSize] = useState(5);
  const [trashHovered, setTrashHovered] = useState(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [trashImage] = useImage('/trash.png');
  const [visualisImage] = useImage('/visualis.png');

  // Handle responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = window.innerHeight - 200;
        setStageSize({
          width: Math.min(containerWidth, 800),
          height: Math.max(containerHeight, 400),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleBodySelect = (body) => {
    setSelectedBody(body);
  };

  const handleAddObject = (object) => {
    const newObject = {
      id: `${object.id}-${Date.now()}`,
      type: object.id,
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      color: object.color,
      emoji: object.emoji,
      rotation: 0,
      radius: 30,
    };
    setPlacedObjects([...placedObjects, newObject]);
  };

  const handleObjectChange = (id, newAttrs) => {
    setPlacedObjects(
      placedObjects.map((obj) => (obj.id === id ? newAttrs : obj))
    );
  };

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    if (selectedId) {
      setPlacedObjects(
        placedObjects.map((obj) =>
          obj.id === selectedId ? { ...obj, color: newColor } : obj
        )
      );
    }
  };

  const handleBodyColorChange = (newColor) => {
    if (selectedBody) {
      setSelectedBody({ ...selectedBody, color: newColor });
    }
  };

  const handleMouseDown = (e) => {
    if (!freeDrawMode) {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color: currentColor, size: brushSize, eraser: eraserMode }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setPlacedObjects([]);
    setLines([]);
    setSelectedBody(null);
    setSelectedId(null);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'my-creature.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center py-4 pr-4 pl-4 lg:pl-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-4xl mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ˗ˏˋ ★ ˎˊ˗ build your own ˗ˏˋ ★ ˎˊ˗
      </motion.h1>

      <p className="text-center mb-4 text-xl font-bonbon tracking-wider" style={{ color: 'var(--text-primary)' }}>
        ⋆｡°✩ design your kirametki creature ✩°｡⋆
      </p>

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl h-full">
        {/* Left Control Panel */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-xl lg:w-64 flex-shrink-0 overflow-y-auto"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          {/* Body Type Selection */}
          <div className="mb-6">
            <h3 className="font-kalnia text-xl gradient-text mb-3">Body Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {bodyTypes.map((body) => (
                <button
                  key={body.id}
                  className={`p-3 rounded-2xl transition-all ${
                    selectedBody?.id === body.id
                      ? 'ring-2 ring-offset-2 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    background: body.color,
                    ringColor: 'var(--accent-primary)',
                  }}
                  onClick={() => handleBodySelect(body)}
                >
                  <div className="text-3xl">{body.emoji}</div>
                  <div className="text-xs font-semibold mt-1 text-white drop-shadow">
                    {body.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Toggles */}
          <div className="mb-6">
            <h3 className="font-kalnia text-xl gradient-text mb-3">Add Parts</h3>
            <div className="space-y-2">
              {Object.keys(objectCategories).map((category) => (
                <button
                  key={category}
                  className={`w-full py-2 px-4 rounded-xl font-medium transition-all ${
                    activeCategory === category
                      ? 'scale-105 shadow-lg'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background:
                      activeCategory === category
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : 'var(--bg-gradient-start)',
                    color: activeCategory === category ? 'white' : 'var(--text-primary)',
                  }}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Object Palette */}
          <div className="mb-6">
            <h3 className="font-kalnia text-lg gradient-text mb-3">
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {objectCategories[activeCategory].map((obj) => (
                <button
                  key={obj.id}
                  className="p-3 rounded-2xl transition-all hover:scale-110 bg-white/80 shadow-md"
                  onClick={() => handleAddObject(obj)}
                  title={`Add ${obj.name}`}
                >
                  <div className="text-3xl">{obj.emoji}</div>
                  <div className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {obj.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="mb-6 space-y-3">
            <h3 className="font-kalnia text-lg gradient-text mb-3">Colors</h3>

            {/* Body Color */}
            {selectedBody && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedBody.color}
                  onChange={(e) => handleBodyColorChange(e.target.value)}
                  className="w-10 h-10 rounded-full cursor-pointer color-picker-clean"
                />
                <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                  Body Color
                </label>
              </div>
            )}

            {/* Object Color */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 rounded-full cursor-pointer color-picker-clean"
                />
                <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                  {selectedId ? 'Selected Object Color' : 'Drawing/Object Color'}
                </label>
              </div>
              {selectedId && (
                <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                  Changes selected object
                </p>
              )}
            </div>
          </div>

          {/* Draw Mode */}
          <div className="mb-6">
            <h3 className="font-kalnia text-lg gradient-text mb-3">Free Draw</h3>
            <button
              className={`w-full py-2 px-4 rounded-xl font-medium transition-all ${
                freeDrawMode ? 'scale-105 shadow-lg' : 'opacity-70'
              }`}
              style={{
                background: freeDrawMode
                  ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  : 'var(--bg-gradient-start)',
                color: freeDrawMode ? 'white' : 'var(--text-primary)',
              }}
              onClick={() => {
                setFreeDrawMode(!freeDrawMode);
                if (!freeDrawMode) setEraserMode(false);
              }}
            >
              {freeDrawMode ? '✏️ Drawing' : '✏️ Enable Draw'}
            </button>
            {freeDrawMode && (
              <div className="mt-3 space-y-3">
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-1 px-3 rounded-lg text-sm font-medium transition-all ${
                      !eraserMode ? 'scale-105 shadow' : 'opacity-60'
                    }`}
                    style={{
                      background: !eraserMode
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : '#e5e7eb',
                      color: !eraserMode ? 'white' : '#6b7280',
                    }}
                    onClick={() => setEraserMode(false)}
                  >
                    ✏️ Pen
                  </button>
                  <button
                    className={`flex-1 py-1 px-3 rounded-lg text-sm font-medium transition-all ${
                      eraserMode ? 'scale-105 shadow' : 'opacity-60'
                    }`}
                    style={{
                      background: eraserMode
                        ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                        : '#e5e7eb',
                      color: eraserMode ? 'white' : '#6b7280',
                    }}
                    onClick={() => setEraserMode(true)}
                  >
                    🧹 Eraser
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {eraserMode ? 'Eraser' : 'Brush'} Size: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              className="w-full py-2 px-4 rounded-xl font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: 'white',
              }}
              onClick={handleExport}
            >
              💾 Export Image
            </button>
            <button
              className="w-full py-2 px-4 rounded-xl font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f87171, #ef4444)',
                color: 'white',
              }}
              onClick={handleClear}
            >
              🗑️ Clear All
            </button>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <motion.div
          ref={containerRef}
          className="flex-1 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-4 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              style={{ background: '#f0f0f0', borderRadius: '12px' }}
            >
              {/* Layer 1: Body and Objects (won't be affected by eraser) */}
              <Layer>
                {/* Trash Can Icon - positioned in bottom-left */}
                {trashImage && (
                  <KonvaImage
                    image={trashImage}
                    x={30}
                    y={stageSize.height - 90}
                    width={60}
                    height={60}
                    opacity={0.7}
                    listening={false}
                  />
                )}

                {/* Body */}
                {selectedBody && (
                  <Circle
                    x={stageSize.width / 2}
                    y={stageSize.height / 2}
                    radius={60}
                    fill={selectedBody.color}
                    onClick={() => setSelectedId(null)}
                  />
                )}

                {/* Placed Objects */}
                {placedObjects.map((obj) => (
                  <DraggableObject
                    key={obj.id}
                    object={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                    onDelete={() => setPlacedObjects(placedObjects.filter(o => o.id !== obj.id))}
                    stageSize={stageSize}
                  />
                ))}
              </Layer>

              {/* Layer 2: Free Draw Lines (eraser only affects this layer) */}
              <Layer>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={line.size}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={line.eraser ? "destination-out" : "source-over"}
                  />
                ))}
              </Layer>
            </Stage>
          </div>

          {!selectedBody && placedObjects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {visualisImage && (
                  <img
                    src="/visualis.png"
                    alt="Palette"
                    className="w-24 h-24 mb-4 opacity-30 mx-auto"
                  />
                )}
                <p className="text-lg font-medium opacity-50" style={{ color: 'var(--text-secondary)' }}>
                  Select a body type to start creating!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
