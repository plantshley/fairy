import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Rect, Text, Group } from 'react-konva';
import useImage from 'use-image';
import { Sparkle } from '../components/Sparkle';

// Body types with SVG files (using versions with "2" in filename for canvas)
const bodyTypes = [
  { id: 'kirarin', name: 'Kirarin', emoji: '🦄', svgPath: '/build-svgs/body-kirarin-white.svg' },
  { id: 'frootie', name: 'Toodie Frootie', emoji: '🍋', svgPath: '/build-svgs/body-frootie-white.svg' },
  { id: 'sylph', name: 'Sylph', emoji: '🦢', svgPath: '/build-svgs/body-sylph.svg' },
  { id: 'griffon', name: 'Griffon', emoji: '🦉', svgPath: '/build-svgs/body-griffon.svg' },
];

// Parts to add (preview uses v1, canvas uses white2)
const parts = {
  eyes: [
    {
      id: 'eyes-sad',
      name: 'Sad Eyes',
      previewPath: '/build-svgs/eyes-sad v1.svg',
      canvasPath: '/build-svgs/eyes-sad v1.svg'
    },
  ],
  limbs: [
    {
      id: 'limb-long',
      name: 'Long Limb',
      previewPath: '/build-svgs/limb-long-white.svg',
      canvasPath: '/build-svgs/limb-long-white.svg'
    },
  ],
};

// Body SVG component with color filter
const BodyImage = ({ body, x, y, onClick, stageSize, bodySizeMultiplier }) => {
  const [image] = useImage(body.svgPath);
  const [filterImage, setFilterImage] = useState(null);

  // Calculate responsive body size - use bodySizeMultiplier prop
  const screenSize = Math.min(stageSize.width, stageSize.height);
  const baseSizeMultiplier = screenSize < 600 ? 0.92 : 0.5;
  const sizeMultiplier = bodySizeMultiplier || baseSizeMultiplier;
  const bodySize = screenSize * sizeMultiplier;
  const bodyOffset = bodySize / 2;

  useEffect(() => {
    if (image && body.color) {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');

      // Draw the original image
      ctx.drawImage(image, 0, 0);

      // Get image data to manipulate pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse the color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const newColor = hexToRgb(body.color);
      const outlineColor = body.outlineColor ? hexToRgb(body.outlineColor) : null;

      // Replace white/light pixels with the new color, dark pixels with outline color
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];

        // Only process pixels with opacity
        if (alpha > 0) {
          // Outline is ~30-40 RGB with full alpha, threshold at 100
          const isLightEnough = r > 100 || g > 100 || b > 100;

          if (isLightEnough) {
            // Light pixels = body fill color
            data[i] = newColor.r;
            data[i + 1] = newColor.g;
            data[i + 2] = newColor.b;
          } else if (outlineColor) {
            // Dark pixels = outline color (if specified)
            data[i] = outlineColor.r;
            data[i + 1] = outlineColor.g;
            data[i + 2] = outlineColor.b;
          }
          // Keep original alpha for anti-aliasing
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const coloredImage = new window.Image();
      coloredImage.src = canvas.toDataURL();
      coloredImage.onload = () => setFilterImage(coloredImage);
    } else {
      setFilterImage(image);
    }
  }, [image, body.color, body.outlineColor]);

  // Adjust y position for toodie frootie - move it higher (scale adjustment with body size)
  const yAdjustment = body.id === 'frootie' ? bodySize * 0.2 : 0;
  const bodyY = y - yAdjustment;

  return (
    <KonvaImage
      image={filterImage || image}
      x={x}
      y={bodyY}
      width={bodySize}
      height={bodySize}
      offsetX={bodyOffset}
      offsetY={bodyOffset}
      onClick={onClick}
    />
  );
};

// Individual draggable SVG image component with color filter
const DraggableImage = ({ object, isSelected, onSelect, onChange, onDelete, stageSize, currentTheme }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(object.svgPath);
  const [filterImage, setFilterImage] = useState(null);
  const [croppedDimensions, setCroppedDimensions] = useState({ width: object.width || 100, height: object.height || 100 });

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  useEffect(() => {
    if (image && object.color) {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');

      // Draw the original image
      ctx.drawImage(image, 0, 0);

      // Get image data to manipulate pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse the color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      const newColor = hexToRgb(object.color);
      const outlineColor = object.outlineColor ? hexToRgb(object.outlineColor) : null;

      // Find the bounding box of non-transparent pixels
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

      // Replace white/light pixels with the new color, dark pixels with outline color
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          // Track bounding box of visible pixels
          if (alpha > 10) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }

          // Only process pixels with opacity
          if (alpha > 0) {
            // Outline is ~30-40 RGB with full alpha, threshold at 50
            const isLightEnough = r > 50 || g > 50 || b > 50;
            const isSemiTransparent = alpha > 0 && alpha < 200;

            if (isLightEnough || isSemiTransparent) {
              // Light pixels = object fill color
              data[i] = newColor.r;
              data[i + 1] = newColor.g;
              data[i + 2] = newColor.b;
            } else if (outlineColor) {
              // Dark pixels = outline color (if specified)
              data[i] = outlineColor.r;
              data[i + 1] = outlineColor.g;
              data[i + 2] = outlineColor.b;
            }
            // Keep original alpha for anti-aliasing
          }
        }
      }

      // Create a cropped canvas with just the content
      const croppedWidth = maxX - minX + 1;
      const croppedHeight = maxY - minY + 1;
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const croppedCtx = croppedCanvas.getContext('2d');

      // Put the colored data back first
      ctx.putImageData(imageData, 0, 0);

      // Draw only the cropped region
      croppedCtx.drawImage(
        canvas,
        minX, minY, croppedWidth, croppedHeight,
        0, 0, croppedWidth, croppedHeight
      );

      const coloredImage = new window.Image();
      coloredImage.src = croppedCanvas.toDataURL();
      coloredImage.onload = () => {
        setFilterImage(coloredImage);
        // Scale the cropped dimensions to match the desired initial size
        const aspectRatio = croppedWidth / croppedHeight;
        const targetWidth = object.width || 100;
        const targetHeight = targetWidth / aspectRatio;
        setCroppedDimensions({ width: targetWidth, height: targetHeight });
      };
    } else if (image) {
      // Even without color, crop to content bounds
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Find the bounding box of non-transparent pixels
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const alpha = data[i + 3];

          if (alpha > 10) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const croppedWidth = maxX - minX + 1;
      const croppedHeight = maxY - minY + 1;
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const croppedCtx = croppedCanvas.getContext('2d');

      croppedCtx.drawImage(
        canvas,
        minX, minY, croppedWidth, croppedHeight,
        0, 0, croppedWidth, croppedHeight
      );

      const croppedImage = new window.Image();
      croppedImage.src = croppedCanvas.toDataURL();
      croppedImage.onload = () => {
        setFilterImage(croppedImage);
        // Scale the cropped dimensions to match the desired initial size
        const aspectRatio = croppedWidth / croppedHeight;
        const targetWidth = object.width || 100;
        const targetHeight = targetWidth / aspectRatio;
        setCroppedDimensions({ width: targetWidth, height: targetHeight });
      };
    }
  }, [image, object.color, object.outlineColor]);

  const checkIfInTrash = (x, y, scale = 1) => {
    const trashX = 60;
    const trashY = stageSize.height - 60;
    const distance = Math.sqrt(Math.pow(x - trashX, 2) + Math.pow(y - trashY, 2));
    // Increase detection radius based on object scale, with a reasonable upper limit
    const detectionRadius = Math.min(60 + (Math.max(scale - 1, 0) * 100), 200);
    return distance < detectionRadius;
  };

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={filterImage || image}
        x={object.x}
        y={object.y}
        width={croppedDimensions.width}
        height={croppedDimensions.height}
        offsetX={croppedDimensions.width / 2}
        offsetY={croppedDimensions.height / 2}
        scaleX={(object.scaleX || 1) * (object.flipped ? -1 : 1)}
        scaleY={object.scaleY || 1}
        rotation={object.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          const scale = Math.max(Math.abs(object.scaleX || 1), Math.abs(object.scaleY || 1));

          if (checkIfInTrash(newX, newY, scale)) {
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
            scaleX: Math.abs(scaleX) * (object.flipped ? 1 : 1),
            scaleY: scaleY,
            rotation: node.rotation(),
            width: croppedDimensions.width,
            height: croppedDimensions.height,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          borderStroke={currentTheme?.colors?.accentPrimary || '#ff9dda'}
          anchorStroke={currentTheme?.colors?.accentPrimary || '#ff9dda'}
          anchorFill={currentTheme?.colors?.accentSecondary || '#c5a3ff'}
          borderStrokeWidth={2}
          anchorSize={8}
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

export const BuildYourOwn = ({ currentTheme }) => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedBody, setSelectedBody] = useState(null);
  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [freeDrawMode, setFreeDrawMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [brushSize, setBrushSize] = useState(5);
  const [trashHovered, setTrashHovered] = useState(false);
  const [history, setHistory] = useState([]);
  const [bodySizeMultiplier, setBodySizeMultiplier] = useState(null);
  const [showBodySizeSlider, setShowBodySizeSlider] = useState(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [trashImage] = useImage('/trash.png');
  const [visualisImage] = useImage('/visualis.png');
  const [undoImage] = useImage('/icons/refresh-data.png');

  // Get current font from CSS variable - recompute when body class changes
  const [currentFont, setCurrentFont] = useState('JetBrains Mono, monospace');

  useEffect(() => {
    const updateFont = () => {
      const bodyFont = getComputedStyle(document.body).getPropertyValue('--font-body').trim();
      setCurrentFont(bodyFont || 'JetBrains Mono, monospace');
    };

    updateFont();

    // Listen for class changes on body
    const observer = new MutationObserver(updateFont);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

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

  // Save current state to history
  const saveToHistory = () => {
    setHistory([...history, {
      placedObjects: [...placedObjects],
      lines: [...lines],
      selectedBody: selectedBody ? { ...selectedBody } : null,
    }]);
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setPlacedObjects(lastState.placedObjects);
    setLines(lastState.lines);
    setSelectedBody(lastState.selectedBody);
    setHistory(history.slice(0, -1));
    setSelectedId(null);
  };

  const handleBodySelect = (body) => {
    setHistory(prev => [...prev, {
      placedObjects: placedObjects,
      lines: lines,
      selectedBody: selectedBody ? { ...selectedBody } : null,
    }]);
    setSelectedBody({ ...body, color: body.color || '#ffffff' });
  };

  const handleAddObject = (part) => {
    setHistory(prev => [...prev, {
      placedObjects: placedObjects,
      lines: lines,
      selectedBody: selectedBody ? { ...selectedBody } : null,
    }]);

    // Calculate responsive initial size - much smaller for added parts
    const screenSize = Math.min(stageSize.width, stageSize.height);
    const initialSize = screenSize < 600 ? screenSize * 0.12 : screenSize * 0.06;

    const newObject = {
      id: `${part.id}-${Date.now()}`,
      type: part.id,
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      svgPath: part.canvasPath,
      rotation: 0,
      width: initialSize,
      height: initialSize,
      scaleX: 1,
      scaleY: 1,
      flipped: false,
      color: currentColor,
      zIndex: 0, // 0 = in front of body, negative = behind body
    };
    setPlacedObjects(prev => [...prev, newObject]);
  };

  const handleFlipObject = () => {
    if (selectedId) {
      saveToHistory();
      setPlacedObjects(
        placedObjects.map((obj) =>
          obj.id === selectedId ? { ...obj, flipped: !obj.flipped } : obj
        )
      );
    }
  };

  const handleMoveLayer = (direction) => {
    if (!selectedId) return;

    saveToHistory();
    const index = placedObjects.findIndex(obj => obj.id === selectedId);
    if (index === -1) return;

    const newObjects = [...placedObjects];

    if (direction === 'up' && index < newObjects.length - 1) {
      [newObjects[index], newObjects[index + 1]] = [newObjects[index + 1], newObjects[index]];
    } else if (direction === 'down' && index > 0) {
      [newObjects[index], newObjects[index - 1]] = [newObjects[index - 1], newObjects[index]];
    } else if (direction === 'front') {
      // Move to front: set zIndex to positive (in front of body)
      newObjects[index] = { ...newObjects[index], zIndex: 0 };
      const obj = newObjects.splice(index, 1)[0];
      newObjects.push(obj);
    } else if (direction === 'back') {
      // Move to back: set zIndex to negative (behind body)
      newObjects[index] = { ...newObjects[index], zIndex: -1 };
      const obj = newObjects.splice(index, 1)[0];
      newObjects.unshift(obj);
    }

    setPlacedObjects(newObjects);
  };

  const handleObjectChange = (id, newAttrs) => {
    setPlacedObjects(
      placedObjects.map((obj) => (obj.id === id ? newAttrs : obj))
    );
  };

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    if (selectedId) {
      saveToHistory();
      setPlacedObjects(
        placedObjects.map((obj) =>
          obj.id === selectedId ? { ...obj, color: newColor } : obj
        )
      );
    }
  };

  const handleObjectOutlineColorChange = (newColor) => {
    if (selectedId) {
      saveToHistory();
      setPlacedObjects(
        placedObjects.map((obj) =>
          obj.id === selectedId ? { ...obj, outlineColor: newColor } : obj
        )
      );
    }
  };

  const handleBodyColorChange = (newColor) => {
    if (selectedBody) {
      saveToHistory();
      setSelectedBody({ ...selectedBody, color: newColor });
    }
  };

  const handleBodyOutlineColorChange = (newColor) => {
    if (selectedBody) {
      saveToHistory();
      setSelectedBody({ ...selectedBody, outlineColor: newColor });
    }
  };

  const handleDuplicateObject = () => {
    if (selectedId) {
      const objectToDuplicate = placedObjects.find(obj => obj.id === selectedId);
      if (objectToDuplicate) {
        saveToHistory();
        const duplicatedObject = {
          ...objectToDuplicate,
          id: `${objectToDuplicate.type}-${Date.now()}`,
          x: objectToDuplicate.x + 20,
          y: objectToDuplicate.y + 20,
        };
        setPlacedObjects(prev => [...prev, duplicatedObject]);
        setSelectedId(duplicatedObject.id);
      }
    }
  };

  const handleMouseDown = (e) => {
    // Check if clicking on the undo button (let it handle its own click)
    const clickedNode = e.target;
    if (clickedNode.attrs && clickedNode.attrs.id === 'undo-button') {
      return;
    }

    if (!freeDrawMode) {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

    saveToHistory();
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
    saveToHistory();
    setPlacedObjects([]);
    setLines([]);
    setSelectedBody(null);
    setSelectedId(null);
  };

  const handleExport = () => {
    // Get only the content layers (first two layers), excluding UI controls layer (third layer)
    const stage = stageRef.current;
    const contentLayer = stage.children[0]; // Layer 1: Body and Objects
    const drawingLayer = stage.children[1]; // Layer 2: Free Draw Lines
    // Layer 3 (UI controls) is NOT included

    // Temporarily create a new stage with just the content layers
    const tempStage = stage.clone();
    tempStage.children = [contentLayer.clone(), drawingLayer.clone()];

    // Export at higher quality: pixelRatio 2-3x for sharper images
    const uri = tempStage.toDataURL({
      pixelRatio: 3, // 3x resolution for crisp, high-quality export
      mimeType: 'image/png', // PNG for lossless quality
    });

    const link = document.createElement('a');
    link.download = 'my-creature.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    tempStage.destroy();
  };

  // Memoize filtered objects for better performance
  const objectsBehindBody = useMemo(
    () => placedObjects.filter(obj => (obj.zIndex || 0) < 0),
    [placedObjects]
  );

  const objectsInFrontOfBody = useMemo(
    () => placedObjects.filter(obj => (obj.zIndex || 0) >= 0),
    [placedObjects]
  );

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-4 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ˗ˏˋ ★ ˎˊ˗ build your own ˗ˏˋ ★ ˎˊ˗
      </motion.h1>

      <p className="text-center mb-2 sm:mb-4 text-base sm:text-lg md:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ⋆｡°✩ design your kirametki creature ✩°｡⋆
      </p>

      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl h-full">
        {/* Left Control Panel */}
        <motion.div
          className="backdrop-blur-md rounded-3xl p-4 shadow-xl lg:w-64 flex-shrink-0 overflow-y-auto"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            maxHeight: 'calc(100vh - 180px)',
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Body Type Selection */}
          <div className="mb-6">
            <h3 className="font-bonbon tracking-wider text-2xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Body Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {bodyTypes.map((body) => (
                <button
                  key={body.id}
                  className={`p-1 rounded-2xl transition-all shadow-md aspect-square flex flex-col items-center justify-center ${
                    selectedBody?.id === body.id
                      ? 'ring-2 ring-offset-2 scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    '--tw-ring-color': currentTheme?.colors?.accentPrimary || '#ff9dda',
                    '--tw-ring-offset-color': currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 1)' : 'rgba(255, 255, 255, 1)',
                    backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  }}
                  onClick={() => handleBodySelect(body)}
                >
                  <div className="text-2xl mb-0.5">{body.emoji}</div>
                  <div className="text-[10px] font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {body.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Parts - Eyes */}
          <div className="mb-6">
            <h3 className="font-bonbon tracking-wider text-2xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Eyes</h3>
            <div className="grid grid-cols-3 gap-2">
              {parts.eyes.map((part) => (
                <button
                  key={part.id}
                  className="p-2 rounded-2xl transition-all hover:scale-110 shadow-md aspect-square flex items-center justify-center"
                  style={{
                    backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  }}
                  onClick={() => handleAddObject(part)}
                  title={`Add ${part.name}`}
                >
                  <img src={part.previewPath} alt={part.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Parts - Limbs */}
          <div className="mb-6">
            <h3 className="font-bonbon tracking-wider text-2xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Limbs</h3>
            <div className="grid grid-cols-3 gap-2">
              {parts.limbs.map((part) => (
                <button
                  key={part.id}
                  className="p-2 rounded-2xl transition-all hover:scale-110 shadow-md aspect-square flex items-center justify-center"
                  style={{
                    backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  }}
                  onClick={() => handleAddObject(part)}
                  title={`Add ${part.name}`}
                >
                  <img src={part.previewPath} alt={part.name} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Layer and Flip Controls */}
          {selectedId && (
            <div className="mb-6">
              <h3 className="font-bonbon tracking-wider text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Selected Object</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={handleFlipObject}
                  >
                    ↔️ Flip
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={handleDuplicateObject}
                  >
                    📋 Duplicate
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('front')}
                  >
                    ⬆️ To Front
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('back')}
                  >
                    ⬇️ To Back
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('up')}
                  >
                    ⏫ Move Up
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('down')}
                  >
                    ⏬ Move Down
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Color Pickers */}
          <div className="mb-6 space-y-2">
            <h3 className="font-bonbon tracking-wider text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Colors</h3>

            {/* Body Color */}
            {selectedBody && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedBody.color || '#ff69b4'}
                    onChange={(e) => handleBodyColorChange(e.target.value)}
                    className="w-4 h-4 rounded-full cursor-pointer color-picker-clean flex-shrink-0"
                  />
                  <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    Body Color
                  </label>
                </div>

                {/* Body Outline Color */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedBody.outlineColor || '#000000'}
                    onChange={(e) => handleBodyOutlineColorChange(e.target.value)}
                    className="w-4 h-4 rounded-full cursor-pointer color-picker-clean flex-shrink-0"
                  />
                  <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    Body Outline
                  </label>
                </div>
              </>
            )}

            {/* Object/Drawing Color */}
            {selectedId ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-4 h-4 rounded-full cursor-pointer color-picker-clean flex-shrink-0"
                  />
                  <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    Object & Drawing Color
                  </label>
                </div>

                {/* Object Outline Color */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={placedObjects.find(obj => obj.id === selectedId)?.outlineColor || '#000000'}
                    onChange={(e) => handleObjectOutlineColorChange(e.target.value)}
                    className="w-4 h-4 rounded-full cursor-pointer color-picker-clean flex-shrink-0"
                  />
                  <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    Object Outline
                  </label>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-4 h-4 rounded-full cursor-pointer color-picker-clean flex-shrink-0"
                />
                <label className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                  Object & Drawing Color
                </label>
              </div>
            )}
          </div>

          {/* Draw Mode */}
          <div className="mb-6">
            <h3 className="font-bonbon tracking-wider text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Free Draw</h3>
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
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
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
                    className="w-full mt-1 brush-slider"
                    style={{
                      '--slider-color': 'var(--accent-primary)',
                    }}
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
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
              }}
              onClick={handleExport}
            >
              💾 Export Image
            </button>
            <button
              className="w-full py-2 px-4 rounded-xl font-medium transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
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
          className="flex-1 backdrop-blur-md rounded-3xl shadow-xl p-4 overflow-hidden"
          style={{
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          }}
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
              {/* Layer 1: Body and Objects (content layer - will be exported) */}
              <Layer>
                {/* Objects behind body (negative zIndex) */}
                {objectsBehindBody.map((obj) => (
                  <DraggableImage
                    key={obj.id}
                    object={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                    onDelete={() => setPlacedObjects(placedObjects.filter(o => o.id !== obj.id))}
                    stageSize={stageSize}
                    currentTheme={currentTheme}
                  />
                ))}

                {/* Body SVG */}
                {selectedBody && (
                  <BodyImage
                    body={selectedBody}
                    x={stageSize.width / 2}
                    y={stageSize.height / 2}
                    onClick={() => setSelectedId(null)}
                    stageSize={stageSize}
                    bodySizeMultiplier={bodySizeMultiplier}
                  />
                )}

                {/* Objects in front of body (zero or positive zIndex) */}
                {objectsInFrontOfBody.map((obj) => (
                  <DraggableImage
                    key={obj.id}
                    object={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                    onDelete={() => setPlacedObjects(placedObjects.filter(o => o.id !== obj.id))}
                    stageSize={stageSize}
                    currentTheme={currentTheme}
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

              {/* Layer 3: UI Controls (NOT exported) */}
              <Layer>
                {/* Body Size Controls - positioned in top-left */}
                {selectedBody && (
                  <Group>
                    {/* Button - responsive sizing */}
                    <Rect
                      x={15}
                      y={15}
                      width={stageSize.width < 600 ? 80 : 100}
                      height={stageSize.width < 600 ? 28 : 35}
                      fill={currentTheme?.colors?.accentPrimary || '#ff9dda'}
                      cornerRadius={10}
                      onClick={() => setShowBodySizeSlider(!showBodySizeSlider)}
                      onTap={() => setShowBodySizeSlider(!showBodySizeSlider)}
                      onMouseEnter={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'pointer';
                        e.target.to({
                          shadowColor: currentTheme?.colors?.accentPrimary || '#ff9dda',
                          shadowBlur: 20,
                          shadowOpacity: 0.8,
                          duration: 0.2
                        });
                      }}
                      onMouseLeave={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'default';
                        e.target.to({
                          shadowBlur: 0,
                          shadowOpacity: 0,
                          duration: 0.2
                        });
                      }}
                    />
                    <Text
                      x={15}
                      y={15}
                      width={stageSize.width < 600 ? 80 : 100}
                      height={stageSize.width < 600 ? 28 : 35}
                      text="Body Size"
                      fontSize={stageSize.width < 600 ? 11 : 14}
                      fontFamily={currentFont}
                      fill="white"
                      align="center"
                      verticalAlign="middle"
                      listening={false}
                    />

                    {/* Slider Panel - appears below button when open */}
                    {showBodySizeSlider && (
                      <Group>
                        <Rect
                          x={15}
                          y={stageSize.width < 600 ? 50 : 60}
                          width={stageSize.width < 600 ? 150 : 180}
                          height={stageSize.width < 600 ? 70 : 80}
                          fill={currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.95)' : 'rgba(255, 255, 255, 0.95)'}
                          cornerRadius={12}
                          shadowColor="black"
                          shadowBlur={10}
                          shadowOpacity={0.3}
                          shadowOffset={{ x: 0, y: 2 }}
                        />
                        <Text
                          x={stageSize.width < 600 ? 25 : 30}
                          y={stageSize.width < 600 ? 60 : 70}
                          text={`Size: ${Math.round((bodySizeMultiplier || (stageSize.width < 600 ? 0.92 : 0.5)) * 100)}%`}
                          fontSize={stageSize.width < 600 ? 10 : 12}
                          fontFamily={currentFont}
                          fill={currentTheme?.colors?.textPrimary || '#8b4f8a'}
                        />
                        {/* Slider track */}
                        <Rect
                          x={stageSize.width < 600 ? 25 : 30}
                          y={stageSize.width < 600 ? 85 : 95}
                          width={stageSize.width < 600 ? 115 : 140}
                          height={6}
                          fill="rgba(0, 0, 0, 0.1)"
                          cornerRadius={3}
                        />
                        {/* Slider filled portion */}
                        <Rect
                          x={stageSize.width < 600 ? 25 : 30}
                          y={stageSize.width < 600 ? 85 : 95}
                          width={(stageSize.width < 600 ? 115 : 140) * ((bodySizeMultiplier || (stageSize.width < 600 ? 0.92 : 0.5)) / 2)}
                          height={6}
                          fill={currentTheme?.colors?.accentPrimary || '#ff9dda'}
                          cornerRadius={3}
                        />
                        {/* Slider thumb */}
                        <Rect
                          x={(stageSize.width < 600 ? 25 : 30) + (stageSize.width < 600 ? 115 : 140) * ((bodySizeMultiplier || (stageSize.width < 600 ? 0.92 : 0.5)) / 2) - 9}
                          y={stageSize.width < 600 ? 79 : 89}
                          width={18}
                          height={18}
                          fill={currentTheme?.colors?.accentPrimary || '#ff9dda'}
                          cornerRadius={9}
                          draggable
                          dragBoundFunc={(pos) => {
                            const minX = (stageSize.width < 600 ? 25 : 30) - 9;
                            const maxX = (stageSize.width < 600 ? 25 : 30) + (stageSize.width < 600 ? 115 : 140) - 9;
                            const newX = Math.max(minX, Math.min(maxX, pos.x));
                            return { x: newX, y: stageSize.width < 600 ? 79 : 89 };
                          }}
                          onDragMove={(e) => {
                            const x = e.target.x();
                            const baseX = stageSize.width < 600 ? 25 : 30;
                            const sliderWidth = stageSize.width < 600 ? 115 : 140;
                            const percent = (x + 9 - baseX) / sliderWidth;
                            const newValue = percent * 2;
                            setBodySizeMultiplier(Math.max(0, Math.min(2.0, newValue)));
                          }}
                          onMouseEnter={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = 'pointer';
                            e.target.to({ scaleX: 1.2, scaleY: 1.2, duration: 0.1 });
                          }}
                          onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = 'default';
                            e.target.to({ scaleX: 1, scaleY: 1, duration: 0.1 });
                          }}
                        />
                        {/* Close button */}
                        <Text
                          x={stageSize.width < 600 ? 150 : 175}
                          y={stageSize.width < 600 ? 55 : 65}
                          text="✕"
                          fontSize={stageSize.width < 600 ? 14 : 16}
                          fill={currentTheme?.colors?.textSecondary || '#9d6b9e'}
                          onClick={() => setShowBodySizeSlider(false)}
                          onTap={() => setShowBodySizeSlider(false)}
                          onMouseEnter={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = 'pointer';
                          }}
                          onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = 'default';
                          }}
                        />
                      </Group>
                    )}
                  </Group>
                )}

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

                {/* Undo Button - positioned in bottom-right */}
                {undoImage && (
                  <KonvaImage
                    id="undo-button"
                    image={undoImage}
                    x={stageSize.width - 90}
                    y={stageSize.height - 90}
                    width={60}
                    height={60}
                    opacity={history.length > 0 ? 1 : 0.3}
                    listening={true}
                    onClick={(e) => {
                      if (history.length > 0) {
                        e.cancelBubble = true;
                        handleUndo();
                      }
                    }}
                    onTap={(e) => {
                      if (history.length > 0) {
                        e.cancelBubble = true;
                        handleUndo();
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (history.length > 0) {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'pointer';
                        e.target.to({
                          shadowColor: currentTheme?.colors?.accentPrimary || '#ff9dda',
                          shadowBlur: 20,
                          shadowOpacity: 0.8,
                          duration: 0.2,
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'default';
                      e.target.to({
                        shadowBlur: 0,
                        shadowOpacity: 0,
                        duration: 0.2,
                      });
                    }}
                  />
                )}
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

      {/* Instagram Tag Text */}
      <motion.p
        className="mt-6 text-center text-xs sm:text-sm px-4 max-w-2xl mx-auto"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {currentTheme?.decorations?.[0] || '～ ♡'} feel free to share your creations on instagram and tag me{' '}
        <a
          href="https://www.instagram.com/kirametki/"
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-text font-semibold hover:opacity-70 transition-opacity"
        >
          @kirametki
        </a>{' '}
        {currentTheme?.decorations?.[1] || '⋆｡°✩'}
      </motion.p>
    </motion.div>
  );
};
