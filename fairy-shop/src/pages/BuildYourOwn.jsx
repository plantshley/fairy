import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Rect, Text, Group, Circle } from 'react-konva';
import useImage from 'use-image';
import { Sparkle } from '../components/Sparkle';

// Body types with SVG files (using versions with "2" in filename for canvas)
const bodyTypes = [
  { id: 'kirarin', name: 'Kirarin', emoji: '🦄', svgPath: '/build-svgs/body-kirarin.svg' },
  { id: 'frootie', name: 'Toodie Frootie', emoji: '🍋', svgPath: '/build-svgs/body-frootie.svg' },
  { id: 'sylph', name: 'Sylph', emoji: '🦢', svgPath: '/build-svgs/body-sylph.svg' },
  { id: 'griffon', name: 'Griffon', emoji: '🦉', svgPath: '/build-svgs/body-griffon.svg' },
  { id: 'harpy', name: 'Harpy', emoji: '🦇', svgPath: '/build-svgs/body-harpy.svg' },
  { id: 'lovely', name: 'Lovely', emoji: '💖', svgPath: '/build-svgs/body-lovely.svg' },
  { id: 'imp', name: 'Imp', emoji: '🐾', svgPath: '/build-svgs/body-imp.svg' },
  { id: 'tenshi-point', name: 'Tenshi (pointy)', emoji: '🪽', svgPath: '/build-svgs/body-tenshi-point.svg' },
  { id: 'tenshi-round', name: 'Tenshi (round)', emoji: '😇', svgPath: '/build-svgs/body-tenshi-round.svg' },
];

// Parts to add (preview uses v1, canvas uses white2)
const parts = {
  eyes: [
    {
      id: 'acc-faceplate',
      name: 'Faceplate',
      previewPath: '/build-svgs/acc-faceplate.svg',
      canvasPath: '/build-svgs/acc-faceplate.svg'
    },
    {
      id: 'acc-faceplate2',
      name: 'Faceplate 2',
      previewPath: '/build-svgs/acc-faceplate2.svg',
      canvasPath: '/build-svgs/acc-faceplate2.svg'
    },
    {
      id: 'acc-faceplate3',
      name: 'Faceplate 3',
      previewPath: '/build-svgs/acc-faceplate3.svg',
      canvasPath: '/build-svgs/acc-faceplate3.svg'
    },
    { id: 'facial_0', name: 'Face 1', previewPath: '/build-svgs/facial_0.svg', canvasPath: '/build-svgs/facial_0.svg' },
    { id: 'facial_1', name: 'Face 2', previewPath: '/build-svgs/facial_1.svg', canvasPath: '/build-svgs/facial_1.svg' },
    { id: 'facial_2', name: 'Face 3', previewPath: '/build-svgs/facial_2.svg', canvasPath: '/build-svgs/facial_2.svg' },
    { id: 'facial_3', name: 'Face 4', previewPath: '/build-svgs/facial_3.svg', canvasPath: '/build-svgs/facial_3.svg' },
    { id: 'facial_4', name: 'Face 5', previewPath: '/build-svgs/facial_4.svg', canvasPath: '/build-svgs/facial_4.svg' },
    { id: 'facial_5', name: 'Face 6', previewPath: '/build-svgs/facial_5.svg', canvasPath: '/build-svgs/facial_5.svg' },
    { id: 'facial_6', name: 'Face 7', previewPath: '/build-svgs/facial_6.svg', canvasPath: '/build-svgs/facial_6.svg' },
    { id: 'facial_7', name: 'Face 8', previewPath: '/build-svgs/facial_7.svg', canvasPath: '/build-svgs/facial_7.svg' },
    { id: 'facial_8', name: 'Face 9', previewPath: '/build-svgs/facial_8.svg', canvasPath: '/build-svgs/facial_8.svg' },
    { id: 'facial_9', name: 'Face 10', previewPath: '/build-svgs/facial_9.svg', canvasPath: '/build-svgs/facial_9.svg' },
    { id: 'facial_10', name: 'Face 11', previewPath: '/build-svgs/facial_10.svg', canvasPath: '/build-svgs/facial_10.svg' },
    { id: 'facial_11', name: 'Face 12', previewPath: '/build-svgs/facial_11.svg', canvasPath: '/build-svgs/facial_11.svg' },
    { id: 'facial_12', name: 'Face 13', previewPath: '/build-svgs/facial_12.svg', canvasPath: '/build-svgs/facial_12.svg' },
    { id: 'facial_13', name: 'Face 14', previewPath: '/build-svgs/facial_13.svg', canvasPath: '/build-svgs/facial_13.svg' },
    { id: 'facial_14', name: 'Face 15', previewPath: '/build-svgs/facial_14.svg', canvasPath: '/build-svgs/facial_14.svg' },
    { id: 'facial_15', name: 'Face 16', previewPath: '/build-svgs/facial_15.svg', canvasPath: '/build-svgs/facial_15.svg' },
    { id: 'facial_16', name: 'Face 17', previewPath: '/build-svgs/facial_16.svg', canvasPath: '/build-svgs/facial_16.svg' },
    { id: 'facial_17', name: 'Face 18', previewPath: '/build-svgs/facial_17.svg', canvasPath: '/build-svgs/facial_17.svg' },
    { id: 'facial_18', name: 'Face 19', previewPath: '/build-svgs/facial_18.svg', canvasPath: '/build-svgs/facial_18.svg' },
    { id: 'facial_20', name: 'Face 20', previewPath: '/build-svgs/facial_20.svg', canvasPath: '/build-svgs/facial_20.svg' },
    { id: 'facial_21', name: 'Face 21', previewPath: '/build-svgs/facial_21.svg', canvasPath: '/build-svgs/facial_21.svg' },
    { id: 'facial_25', name: 'Face 22', previewPath: '/build-svgs/facial_25.svg', canvasPath: '/build-svgs/facial_25.svg' },
    { id: 'facial_26', name: 'Face 23', previewPath: '/build-svgs/facial_26.svg', canvasPath: '/build-svgs/facial_26.svg' },
    { id: 'facial_27', name: 'Face 24', previewPath: '/build-svgs/facial_27.svg', canvasPath: '/build-svgs/facial_27.svg' },
    { id: 'facial_28', name: 'Face 25', previewPath: '/build-svgs/facial_28.svg', canvasPath: '/build-svgs/facial_28.svg' },
    { id: 'facial_29', name: 'Face 26', previewPath: '/build-svgs/facial_29.svg', canvasPath: '/build-svgs/facial_29.svg' },
    { id: 'facial_30', name: 'Face 27', previewPath: '/build-svgs/facial_30.svg', canvasPath: '/build-svgs/facial_30.svg' },
    { id: 'facial_31', name: 'Face 28', previewPath: '/build-svgs/facial_31.svg', canvasPath: '/build-svgs/facial_31.svg' },
    { id: 'facial_32', name: 'Face 29', previewPath: '/build-svgs/facial_32.svg', canvasPath: '/build-svgs/facial_32.svg' },
    { id: 'facial_33', name: 'Face 30', previewPath: '/build-svgs/facial_33.svg', canvasPath: '/build-svgs/facial_33.svg' },
    { id: 'facial_34', name: 'Face 31', previewPath: '/build-svgs/facial_34.svg', canvasPath: '/build-svgs/facial_34.svg' },
    { id: 'facial_35', name: 'Face 32', previewPath: '/build-svgs/facial_35.svg', canvasPath: '/build-svgs/facial_35.svg' },
    { id: 'facial_36', name: 'Face 33', previewPath: '/build-svgs/facial_36.svg', canvasPath: '/build-svgs/facial_36.svg' },
    { id: 'facial_37', name: 'Face 34', previewPath: '/build-svgs/facial_37.svg', canvasPath: '/build-svgs/facial_37.svg' },
    { id: 'facial_38', name: 'Face 35', previewPath: '/build-svgs/facial_38.svg', canvasPath: '/build-svgs/facial_38.svg' },
    { id: 'facial_39', name: 'Face 36', previewPath: '/build-svgs/facial_39.svg', canvasPath: '/build-svgs/facial_39.svg' },
    { id: 'facial_40', name: 'Face 37', previewPath: '/build-svgs/facial_40.svg', canvasPath: '/build-svgs/facial_40.svg' },
    { id: 'facial_41', name: 'Face 38', previewPath: '/build-svgs/facial_41.svg', canvasPath: '/build-svgs/facial_41.svg' },
    { id: 'facial_52', name: 'Face 39', previewPath: '/build-svgs/facial_52.svg', canvasPath: '/build-svgs/facial_52.svg' },
    { id: 'eyes-sad-left', name: 'Sad Eye (L)', previewPath: '/build-svgs/eyes-sad-left.svg', canvasPath: '/build-svgs/eyes-sad-left.svg' },
    { id: 'eyes-sad-right', name: 'Sad Eye (R)', previewPath: '/build-svgs/eyes-sad-right.svg', canvasPath: '/build-svgs/eyes-sad-right.svg' },
  ],
  limbs: [
    {
      id: 'limbs-long',
      name: 'Long',
      previewPath: '/build-svgs/limbs-long.svg',
      canvasPath: '/build-svgs/limbs-long.svg'
    },
    {
      id: 'limbs-long2',
      name: 'Long 2',
      previewPath: '/build-svgs/limbs-long2.svg',
      canvasPath: '/build-svgs/limbs-long2.svg'
    },
    {
      id: 'limbs-med',
      name: 'Medium',
      previewPath: '/build-svgs/limbs-med.svg',
      canvasPath: '/build-svgs/limbs-med.svg'
    },
    {
      id: 'limbs-short',
      name: 'Short',
      previewPath: '/build-svgs/limbs-short.svg',
      canvasPath: '/build-svgs/limbs-short.svg'
    },
    {
      id: 'limbs-long-toes',
      name: 'Long Toes',
      previewPath: '/build-svgs/limbs-long-toes.svg',
      canvasPath: '/build-svgs/limbs-long-toes.svg'
    },
    {
      id: 'limbs-short-toes',
      name: 'Short Toes',
      previewPath: '/build-svgs/limbs-short-toes.svg',
      canvasPath: '/build-svgs/limbs-short-toes.svg'
    },
  ],
  accessories: [
    { id: 'acc-sparkle', name: 'Sparkle', previewPath: '/build-svgs/acc-sparkle.svg', canvasPath: '/build-svgs/acc-sparkle.svg' },
    { id: 'acc-heart', name: 'Heart', previewPath: '/build-svgs/acc-heart.svg', canvasPath: '/build-svgs/acc-heart.svg' },
    { id: 'acc-star', name: 'Star', previewPath: '/build-svgs/acc-star.svg', canvasPath: '/build-svgs/acc-star.svg' },
    { id: 'acc-crown', name: 'Crown', previewPath: '/build-svgs/acc-crown.svg', canvasPath: '/build-svgs/acc-crown.svg' },
    { id: 'acc-halo', name: 'Halo', previewPath: '/build-svgs/acc-halo.svg', canvasPath: '/build-svgs/acc-halo.svg' },
    { id: 'acc-boot1', name: 'Boot 1', previewPath: '/build-svgs/acc-boot1.svg', canvasPath: '/build-svgs/acc-boot1.svg' },
    { id: 'acc-boot2', name: 'Boot 2', previewPath: '/build-svgs/acc-boot2.svg', canvasPath: '/build-svgs/acc-boot2.svg' },
    { id: 'acc-boot3', name: 'Boot 3', previewPath: '/build-svgs/acc-boot3.svg', canvasPath: '/build-svgs/acc-boot3.svg' },
    { id: 'acc-frill', name: 'Frill', previewPath: '/build-svgs/acc-frill.svg', canvasPath: '/build-svgs/acc-frill.svg' },
    { id: 'acc-frill2', name: 'Frill 2', previewPath: '/build-svgs/acc-frill2.svg', canvasPath: '/build-svgs/acc-frill2.svg' },
    { id: 'acc_0', name: 'Acc 1', previewPath: '/build-svgs/acc_0.svg', canvasPath: '/build-svgs/acc_0.svg' },
    { id: 'acc_1', name: 'Acc 2', previewPath: '/build-svgs/acc_1.svg', canvasPath: '/build-svgs/acc_1.svg' },
    { id: 'acc_2', name: 'Acc 3', previewPath: '/build-svgs/acc_2.svg', canvasPath: '/build-svgs/acc_2.svg' },
    { id: 'acc_3', name: 'Acc 4', previewPath: '/build-svgs/acc_3.svg', canvasPath: '/build-svgs/acc_3.svg' },
    { id: 'acc_4', name: 'Acc 5', previewPath: '/build-svgs/acc_4.svg', canvasPath: '/build-svgs/acc_4.svg' },
    { id: 'acc_5', name: 'Acc 6', previewPath: '/build-svgs/acc_5.svg', canvasPath: '/build-svgs/acc_5.svg' },
    { id: 'acc_6', name: 'Acc 7', previewPath: '/build-svgs/acc_6.svg', canvasPath: '/build-svgs/acc_6.svg' },
    { id: 'acc_7', name: 'Acc 8', previewPath: '/build-svgs/acc_7.svg', canvasPath: '/build-svgs/acc_7.svg' },
    { id: 'acc_8', name: 'Acc 9', previewPath: '/build-svgs/acc_8.svg', canvasPath: '/build-svgs/acc_8.svg' },
    { id: 'acc_9', name: 'Acc 10', previewPath: '/build-svgs/acc_9.svg', canvasPath: '/build-svgs/acc_9.svg' },
    { id: 'acc_10', name: 'Acc 11', previewPath: '/build-svgs/acc_10.svg', canvasPath: '/build-svgs/acc_10.svg' },
    { id: 'acc_11', name: 'Acc 12', previewPath: '/build-svgs/acc_11.svg', canvasPath: '/build-svgs/acc_11.svg' },
    { id: 'acc_12', name: 'Acc 13', previewPath: '/build-svgs/acc_12.svg', canvasPath: '/build-svgs/acc_12.svg' },
    { id: 'acc_13', name: 'Acc 14', previewPath: '/build-svgs/acc_13.svg', canvasPath: '/build-svgs/acc_13.svg' },
    { id: 'acc_14', name: 'Acc 15', previewPath: '/build-svgs/acc_14.svg', canvasPath: '/build-svgs/acc_14.svg' },
    { id: 'acc_15', name: 'Acc 16', previewPath: '/build-svgs/acc_15.svg', canvasPath: '/build-svgs/acc_15.svg' },
    { id: 'acc_16', name: 'Acc 17', previewPath: '/build-svgs/acc_16.svg', canvasPath: '/build-svgs/acc_16.svg' },
  ],
  earsWingsTails: [
    { id: 'ear1', name: 'Ear 1', previewPath: '/build-svgs/ear1.svg', canvasPath: '/build-svgs/ear1.svg' },
    { id: 'ear2', name: 'Ear 2', previewPath: '/build-svgs/ear2.svg', canvasPath: '/build-svgs/ear2.svg' },
    { id: 'ear3', name: 'Ear 3', previewPath: '/build-svgs/ear3.svg', canvasPath: '/build-svgs/ear3.svg' },
    { id: 'ear4', name: 'Ear 4', previewPath: '/build-svgs/ear4.svg', canvasPath: '/build-svgs/ear4.svg' },
    { id: 'ear5', name: 'Ear 5', previewPath: '/build-svgs/ear5.svg', canvasPath: '/build-svgs/ear5.svg' },
    { id: 'wings-angel', name: 'Angel Wings', previewPath: '/build-svgs/wings-angel.svg', canvasPath: '/build-svgs/wings-angel.svg' },
    { id: 'wings-bat', name: 'Bat Wings', previewPath: '/build-svgs/wings-bat.svg', canvasPath: '/build-svgs/wings-bat.svg' },
    { id: 'acc-horn1', name: 'Horn 1', previewPath: '/build-svgs/acc-horn1.svg', canvasPath: '/build-svgs/acc-horn1.svg' },
    { id: 'acc-horn2', name: 'Horn 2', previewPath: '/build-svgs/acc-horn2.svg', canvasPath: '/build-svgs/acc-horn2.svg' },
    { id: 'acc-horn3', name: 'Horn 3', previewPath: '/build-svgs/acc-horn3.svg', canvasPath: '/build-svgs/acc-horn3.svg' },
    { id: 'acc-horn4', name: 'Horn 4', previewPath: '/build-svgs/acc-horn4.svg', canvasPath: '/build-svgs/acc-horn4.svg' },
    { id: 'tail1', name: 'Tail 1', previewPath: '/build-svgs/tail1.svg', canvasPath: '/build-svgs/tail1.svg' },
    { id: 'tail2', name: 'Tail 2', previewPath: '/build-svgs/tail2.svg', canvasPath: '/build-svgs/tail2.svg' },
    { id: 'tail3', name: 'Tail 3', previewPath: '/build-svgs/tail3.svg', canvasPath: '/build-svgs/tail3.svg' },
    { id: 'tail4', name: 'Tail 4', previewPath: '/build-svgs/tail4.svg', canvasPath: '/build-svgs/tail4.svg' },
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

  // Calculate width and height based on image aspect ratio
  const aspectRatio = image ? image.width / image.height : 1;
  const bodyWidth = aspectRatio >= 1 ? bodySize : bodySize * aspectRatio;
  const bodyHeight = aspectRatio >= 1 ? bodySize / aspectRatio : bodySize;
  const bodyOffsetX = bodyWidth / 2;
  const bodyOffsetY = bodyHeight / 2;

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
      width={bodyWidth}
      height={bodyHeight}
      offsetX={bodyOffsetX}
      offsetY={bodyOffsetY}
      onClick={onClick}
      hitFunc={(context, shape) => {
        // Custom hit detection - only register hits on non-transparent pixels
        const img = filterImage || image;
        if (!img) return;

        context.beginPath();
        const width = shape.width();
        const height = shape.height();

        // Create a rectangular hit region for the image bounds
        context.rect(0, 0, width, height);
        context.closePath();

        // Let Konva check if the point is in bounds, then we'll check alpha
        const pos = shape.getStage().getPointerPosition();
        if (!pos) return; // Pointer is outside the stage
        const transform = shape.getAbsoluteTransform().copy();
        transform.invert();
        const localPos = transform.point(pos);

        // Convert to image coordinates
        const imgX = Math.floor((localPos.x + shape.offsetX()) / width * img.width);
        const imgY = Math.floor((localPos.y + shape.offsetY()) / height * img.height);

        // Check if within image bounds
        if (imgX < 0 || imgX >= img.width || imgY < 0 || imgY >= img.height) {
          return;
        }

        // Sample pixel alpha
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(imgX, imgY, 1, 1);
        const alpha = imageData.data[3];

        // Only register hit if alpha is significant (not transparent)
        if (alpha > 10) {
          context.fillStrokeShape(shape);
        }
      }}
    />
  );
};

// Individual draggable SVG image component with color filter
const DraggableImage = ({ object, isSelected, onSelect, onChange, onDelete, stageSize, stageScale, stagePosition, currentTheme, onTransformStart, onDragStart, freeDrawMode }) => {
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
            // Outline is ~30-40 RGB with full alpha, threshold at 100 (same as body)
            const isLightEnough = r > 100 || g > 100 || b > 100;

            if (isLightEnough) {
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
    // Convert object position from world space (content layer) to screen space (UI layer)
    // The content layer has stage transforms applied, UI layer has inverse transforms
    const screenX = (x * stageScale) + stagePosition.x;
    const screenY = (y * stageScale) + stagePosition.y;

    // Trash is in UI layer at these screen space coordinates
    const trashX = 60;
    const trashY = stageSize.height - 60;

    const distance = Math.sqrt(Math.pow(screenX - trashX, 2) + Math.pow(screenY - trashY, 2));
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
        draggable={!freeDrawMode}
        onClick={freeDrawMode ? undefined : onSelect}
        onTap={freeDrawMode ? undefined : onSelect}
        onDragStart={freeDrawMode ? undefined : onDragStart}
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
        onTransformStart={onTransformStart}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...object,
            x: node.x(),
            y: node.y(),
            scaleX: Math.abs(scaleX) * (object.flipped ? -1 : 1),
            scaleY: scaleY,
            rotation: node.rotation(),
            width: croppedDimensions.width,
            height: croppedDimensions.height,
          });
        }}
      />
      {isSelected && !freeDrawMode && (
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
  const [tempSliderPos, setTempSliderPos] = useState(null);
  const [trashHovered, setTrashHovered] = useState(false);
  const [history, setHistory] = useState([]);
  const [bodySizeMultiplier, setBodySizeMultiplier] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    bodyType: false,
    facial: true,
    limbs: true,
    accessories: true,
    earsWingsTails: true,
  });
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [panMode, setPanMode] = useState(false);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  // Refs to track current zoom/pan state for smooth touch gestures
  const stageScaleRef = useRef(1);
  const stagePositionRef = useRef({ x: 0, y: 0 });
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

    // Calculate responsive initial size
    const screenSize = Math.min(stageSize.width, stageSize.height);
    // Accessories, limbs, ears, tails, and horns are bigger; only eyes/facial are smaller
    const isAccessory = part.id.startsWith('acc-');
    const isLimb = part.id.startsWith('limbs-');
    const isEarWingTail = part.id.startsWith('ear') || part.id.startsWith('tail');
    const isBiggerPart = isAccessory || isLimb || isEarWingTail;
    const initialSize = screenSize < 600
      ? (isBiggerPart ? screenSize * 0.18 : screenSize * 0.12)
      : (isBiggerPart ? screenSize * 0.10 : screenSize * 0.06);

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
      zIndex: 1, // Start at 1 = in front of body (0), negative = behind body
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

  const handleTransformStart = () => {
    saveToHistory();
  };

  const handleDragStart = () => {
    saveToHistory();
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

  // Zoom and pan handlers
  const handleZoom = (direction) => {
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stageScale;
    const newScale = direction === 'in'
      ? Math.min(oldScale * scaleBy, 3) // Max zoom 3x
      : Math.max(oldScale / scaleBy, 0.5); // Min zoom 0.5x

    // Zoom towards center
    const centerX = stageSize.width / 2;
    const centerY = stageSize.height / 2;

    const mousePointTo = {
      x: (centerX - stagePosition.x) / oldScale,
      y: (centerY - stagePosition.y) / oldScale,
    };

    const newPos = {
      x: centerX - mousePointTo.x * newScale,
      y: centerY - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  };

  const handleResetView = () => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.05;
    const oldScale = stageScale;

    // Get pointer position relative to stage
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0
      ? Math.min(oldScale * scaleBy, 3)
      : Math.max(oldScale / scaleBy, 0.5);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  };

  // Handle spacebar for panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleStageMouseDown = (e) => {
    // Enable panning with middle mouse button, when space is held, or when pan mode is active
    if (e.evt.button === 1 || spacePressed || panMode) {
      e.evt.preventDefault();
      setIsPanning(true);
      return;
    }

    // Otherwise handle normal mouse down
    handleMouseDown(e);
  };

  const handleStageMouseUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    handleMouseUp(e);
  };

  const handleStageMouseMove = (e) => {
    if (isPanning) {
      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      const dx = pointer.x - (stage.getPointerPosition().x - e.evt.movementX);
      const dy = pointer.y - (stage.getPointerPosition().y - e.evt.movementY);

      setStagePosition({
        x: stagePosition.x + e.evt.movementX,
        y: stagePosition.y + e.evt.movementY,
      });
      return;
    }

    handleMouseMove(e);
  };

  // Keep refs in sync with state
  useEffect(() => {
    stageScaleRef.current = stageScale;
    stagePositionRef.current = stagePosition;
  }, [stageScale, stagePosition]);

  // Improved touch gestures: simultaneous pinch-to-zoom and two-finger pan using refs for smooth performance
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let lastDist = null;
    let lastCenter = null;

    const getDistance = (p1, p2) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    const getCenter = (p1, p2) => {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    };

    const handleTouchStart = (e) => {
      const touches = e.touches;
      if (touches && touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();

        const p1 = { x: touches[0].clientX, y: touches[0].clientY };
        const p2 = { x: touches[1].clientX, y: touches[1].clientY };

        lastDist = getDistance(p1, p2);
        lastCenter = getCenter(p1, p2);
      }
      // Don't prevent default for single-finger touches - let them pass through
    };

    const handleTouchMove = (e) => {
      const touches = e.touches;

      if (touches && touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();

        const p1 = { x: touches[0].clientX, y: touches[0].clientY };
        const p2 = { x: touches[1].clientX, y: touches[1].clientY };

        const newCenter = getCenter(p1, p2);
        const newDist = getDistance(p1, p2);

        if (lastDist === null || lastCenter === null) {
          lastDist = newDist;
          lastCenter = newCenter;
          return;
        }

        const stageBox = stage.container().getBoundingClientRect();

        // Read current values from refs instead of stale closures
        const currentScale = stageScaleRef.current;
        const currentPosition = stagePositionRef.current;

        // Calculate the scale change from pinch
        const scaleChange = newDist / lastDist;
        let newScale = currentScale * scaleChange;
        newScale = Math.max(0.5, Math.min(newScale, 3));

        // Calculate the content point under the last gesture center
        const contentX = (lastCenter.x - stageBox.left - currentPosition.x) / currentScale;
        const contentY = (lastCenter.y - stageBox.top - currentPosition.y) / currentScale;

        // Calculate new position to keep content point under new center after zoom
        let newX = newCenter.x - stageBox.left - contentX * newScale;
        let newY = newCenter.y - stageBox.top - contentY * newScale;

        const newPos = {
          x: newX,
          y: newY,
        };

        // Update refs immediately for next touch event
        stageScaleRef.current = newScale;
        stagePositionRef.current = newPos;

        // Update state directly (no requestAnimationFrame for immediate response)
        setStageScale(newScale);
        setStagePosition(newPos);

        lastDist = newDist;
        lastCenter = newCenter;
      }
      // Don't prevent default for single-finger touches - let them pass through
    };

    const handleTouchEnd = (e) => {
      if (!e.touches || e.touches.length < 2) {
        lastDist = null;
        lastCenter = null;
      }
    };

    const stageContainer = stage.container();
    stageContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    stageContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    stageContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    stageContainer.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      stageContainer.removeEventListener('touchstart', handleTouchStart);
      stageContainer.removeEventListener('touchmove', handleTouchMove);
      stageContainer.removeEventListener('touchend', handleTouchEnd);
      stageContainer.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []); // No dependencies - event listeners set up once and use refs

  const handleMouseDown = (e) => {
    // Check if clicking on the undo button (let it handle its own click)
    const clickedNode = e.target;
    if (clickedNode.attrs && clickedNode.attrs.id === 'undo-button') {
      return;
    }

    // Check if clicking on free draw controls (prevent drawing on the controls)
    if (clickedNode.attrs && clickedNode.attrs.id && clickedNode.attrs.id.startsWith('freedraw-')) {
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
    // Transform pointer position to account for zoom and pan
    const transformedX = (pos.x - stagePosition.x) / stageScale;
    const transformedY = (pos.y - stagePosition.y) / stageScale;
    setLines([...lines, { points: [transformedX, transformedY], color: currentColor, size: brushSize, eraser: eraserMode }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    // Transform pointer position to account for zoom and pan
    const transformedX = (point.x - stagePosition.x) / stageScale;
    const transformedY = (point.y - stagePosition.y) / stageScale;
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([transformedX, transformedY]);
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
            <button
              className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
              onClick={() => setCollapsedSections({ ...collapsedSections, bodyType: !collapsedSections.bodyType })}
            >
              <h3 className="font-bonbon tracking-wider text-xl font-bold text-center flex-1" style={{ color: 'var(--text-primary)' }}>Body Type</h3>
              <span className={collapsedSections.bodyType ? 'text-sm' : 'text-xl'} style={{ color: 'var(--text-secondary)' }}>{collapsedSections.bodyType ? '▶' : '▼'}</span>
            </button>
            {!collapsedSections.bodyType && (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
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

                {/* Body Size Slider - shown when body is selected */}
                {selectedBody && (
                  <div className="mt-3 space-y-2">
                    <label className="text-xs font-medium block" style={{ color: 'var(--text-secondary)' }}>
                      Body Size: {Math.round((bodySizeMultiplier || 0.5) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={bodySizeMultiplier || 0.5}
                      onChange={(e) => setBodySizeMultiplier(parseFloat(e.target.value))}
                      className="w-full brush-slider"
                      style={{
                        '--slider-color': 'var(--accent-primary)',
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Parts - Facial */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
              onClick={() => setCollapsedSections({ ...collapsedSections, facial: !collapsedSections.facial })}
            >
              <h3 className="font-bonbon tracking-wider text-xl font-bold text-center flex-1" style={{ color: 'var(--text-primary)' }}>Facial</h3>
              <span className={collapsedSections.facial ? 'text-sm' : 'text-xl'} style={{ color: 'var(--text-secondary)' }}>{collapsedSections.facial ? '▶' : '▼'}</span>
            </button>
            {!collapsedSections.facial && (
              <div className="grid grid-cols-4 gap-2">
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
            )}
          </div>

          {/* Parts - Limbs */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
              onClick={() => setCollapsedSections({ ...collapsedSections, limbs: !collapsedSections.limbs })}
            >
              <h3 className="font-bonbon tracking-wider text-xl font-bold text-center flex-1" style={{ color: 'var(--text-primary)' }}>Limbs</h3>
              <span className={collapsedSections.limbs ? 'text-sm' : 'text-xl'} style={{ color: 'var(--text-secondary)' }}>{collapsedSections.limbs ? '▶' : '▼'}</span>
            </button>
            {!collapsedSections.limbs && (
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
            )}
          </div>

          {/* Parts - Accessories */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
              onClick={() => setCollapsedSections({ ...collapsedSections, accessories: !collapsedSections.accessories })}
            >
              <h3 className="font-bonbon tracking-wider text-xl font-bold text-center flex-1" style={{ color: 'var(--text-primary)' }}>Accessories</h3>
              <span className={collapsedSections.accessories ? 'text-sm' : 'text-xl'} style={{ color: 'var(--text-secondary)' }}>{collapsedSections.accessories ? '▶' : '▼'}</span>
            </button>
            {!collapsedSections.accessories && (
              <div className="grid grid-cols-4 gap-2">
                {parts.accessories.map((part) => (
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
            )}
          </div>

          {/* Parts - Ears, Wings, Horns, & Tails */}
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
              onClick={() => setCollapsedSections({ ...collapsedSections, earsWingsTails: !collapsedSections.earsWingsTails })}
            >
              <h3 className="font-bonbon tracking-wider text-xl font-bold text-center flex-1" style={{ color: 'var(--text-primary)' }}>Other Body Parts</h3>
              <span className={collapsedSections.earsWingsTails ? 'text-sm' : 'text-xl'} style={{ color: 'var(--text-secondary)' }}>{collapsedSections.earsWingsTails ? '▶' : '▼'}</span>
            </button>
            {!collapsedSections.earsWingsTails && (
              <div className="grid grid-cols-4 gap-2">
                {parts.earsWingsTails.map((part) => (
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
            )}
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
              scaleX={stageScale}
              scaleY={stageScale}
              x={stagePosition.x}
              y={stagePosition.y}
              onWheel={handleWheel}
              onMouseDown={handleStageMouseDown}
              onMousemove={handleStageMouseMove}
              onMouseup={handleStageMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              style={{
                background: currentTheme?.id === 'midnightVelvetMeadow' ? '#1a0a1f' : '#f0f0f0',
                borderRadius: '12px',
                cursor: isPanning ? 'grabbing' : (spacePressed || panMode) ? 'grab' : 'default'
              }}
            >
              {/* Layer 1: Body and Objects (content layer - will be exported) */}
              <Layer>
                {/* Objects behind body (negative zIndex) */}
                {placedObjects.filter(obj => (obj.zIndex || 0) < 0).map((obj) => (
                  <DraggableImage
                    key={obj.id}
                    object={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                    onDelete={() => setPlacedObjects(placedObjects.filter(o => o.id !== obj.id))}
                    onTransformStart={handleTransformStart}
                    onDragStart={handleDragStart}
                    freeDrawMode={freeDrawMode}
                    stageSize={stageSize}
                    stageScale={stageScale}
                    stagePosition={stagePosition}
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
                {placedObjects.filter(obj => (obj.zIndex || 0) >= 0).map((obj) => (
                  <DraggableImage
                    key={obj.id}
                    object={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => setSelectedId(obj.id)}
                    onChange={(newAttrs) => handleObjectChange(obj.id, newAttrs)}
                    onDelete={() => setPlacedObjects(placedObjects.filter(o => o.id !== obj.id))}
                    onTransformStart={handleTransformStart}
                    onDragStart={handleDragStart}
                    freeDrawMode={freeDrawMode}
                    stageSize={stageSize}
                    stageScale={stageScale}
                    stagePosition={stagePosition}
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
              <Layer
                scaleX={1 / stageScale}
                scaleY={1 / stageScale}
                x={-stagePosition.x / stageScale}
                y={-stagePosition.y / stageScale}
              >

                {/* Zoom Controls - positioned in upper right corner */}
                <Group>
                  {/* Pan Mode Toggle Button */}
                  <Rect
                    x={stageSize.width - (stageSize.width < 600 ? 205 : 230)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    fill={panMode ? (currentTheme?.colors?.accentPrimary || '#ff9dda') : (currentTheme?.colors?.accentSecondary || '#c5a3ff')}
                    cornerRadius={10}
                    onClick={() => setPanMode(!panMode)}
                    onTap={() => setPanMode(!panMode)}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                      e.target.to({
                        shadowColor: panMode ? (currentTheme?.colors?.accentPrimary || '#ff9dda') : (currentTheme?.colors?.accentSecondary || '#c5a3ff'),
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
                    x={stageSize.width - (stageSize.width < 600 ? 205 : 230)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    text="✋"
                    fontSize={stageSize.width < 600 ? 16 : 20}
                    fontFamily={currentFont}
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                  />

                  {/* Zoom In Button */}
                  <Rect
                    x={stageSize.width - (stageSize.width < 600 ? 155 : 175)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    fill={currentTheme?.colors?.accentSecondary || '#c5a3ff'}
                    cornerRadius={10}
                    onClick={() => handleZoom('in')}
                    onTap={() => handleZoom('in')}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                      e.target.to({
                        shadowColor: currentTheme?.colors?.accentSecondary || '#c5a3ff',
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
                    x={stageSize.width - (stageSize.width < 600 ? 155 : 175)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    text="+"
                    fontSize={stageSize.width < 600 ? 18 : 22}
                    fontFamily={currentFont}
                    fontStyle="bold"
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                  />

                  {/* Zoom Out Button */}
                  <Rect
                    x={stageSize.width - (stageSize.width < 600 ? 110 : 120)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    fill={currentTheme?.colors?.accentSecondary || '#c5a3ff'}
                    cornerRadius={10}
                    onClick={() => handleZoom('out')}
                    onTap={() => handleZoom('out')}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                      e.target.to({
                        shadowColor: currentTheme?.colors?.accentSecondary || '#c5a3ff',
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
                    x={stageSize.width - (stageSize.width < 600 ? 110 : 120)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    text="-"
                    fontSize={stageSize.width < 600 ? 18 : 22}
                    fontFamily={currentFont}
                    fontStyle="bold"
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                  />

                  {/* Reset View Button */}
                  <Rect
                    x={stageSize.width - (stageSize.width < 600 ? 65 : 65)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    fill={currentTheme?.colors?.accentSecondary || '#c5a3ff'}
                    cornerRadius={10}
                    onClick={handleResetView}
                    onTap={handleResetView}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                      e.target.to({
                        shadowColor: currentTheme?.colors?.accentSecondary || '#c5a3ff',
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
                    x={stageSize.width - (stageSize.width < 600 ? 65 : 65)}
                    y={15}
                    width={stageSize.width < 600 ? 35 : 45}
                    height={stageSize.width < 600 ? 28 : 35}
                    text="⟲"
                    fontSize={stageSize.width < 600 ? 16 : 20}
                    fontFamily={currentFont}
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                  />
                </Group>

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

                {/* Free Draw Controls - positioned in top-left corner */}
                <Group x={15} y={15} id="freedraw-group">
                  {/* Main toggle button */}
                  <Group>
                    <Rect
                      id="freedraw-toggle"
                      width={stageSize.width < 600 ? 110 : 125}
                      height={stageSize.width < 600 ? 28 : 35}
                      fill={freeDrawMode
                        ? currentTheme?.colors?.accentPrimary || '#ff9dda'
                        : currentTheme?.colors?.accentSecondary || '#c5a3ff'}
                      cornerRadius={10}
                      onClick={() => {
                        setFreeDrawMode(!freeDrawMode);
                        if (!freeDrawMode) setEraserMode(false);
                      }}
                      onTap={() => {
                        setFreeDrawMode(!freeDrawMode);
                        if (!freeDrawMode) setEraserMode(false);
                      }}
                      onMouseEnter={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = 'pointer';
                        e.target.to({
                          shadowColor: freeDrawMode ? (currentTheme?.colors?.accentPrimary || '#ff9dda') : (currentTheme?.colors?.accentSecondary || '#c5a3ff'),
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
                      text={freeDrawMode ? '✏️ Drawing' : '✏️ Enable Draw'}
                      fontSize={stageSize.width < 600 ? 11 : 13}
                      fontFamily={currentFont}
                      fontStyle="500"
                      fill="white"
                      width={stageSize.width < 600 ? 110 : 125}
                      height={stageSize.width < 600 ? 28 : 35}
                      align="center"
                      verticalAlign="middle"
                      listening={false}
                    />
                  </Group>

                  {/* Expanded controls when free draw is enabled */}
                  {freeDrawMode && (
                    <Group y={stageSize.width < 600 ? 36 : 43}>
                      {/* Pen/Eraser toggle buttons */}
                      <Group>
                        {/* Pen button */}
                        <Group>
                          <Rect
                            id="freedraw-pen"
                            width={stageSize.width < 600 ? 50 : 58}
                            height={stageSize.width < 600 ? 26 : 30}
                            fill={!eraserMode
                              ? currentTheme?.colors?.accentPrimary || '#ff9dda'
                              : '#e5e7eb'}
                            cornerRadius={8}
                            onClick={() => setEraserMode(false)}
                            onTap={() => setEraserMode(false)}
                            onMouseEnter={(e) => {
                              const container = e.target.getStage().container();
                              container.style.cursor = 'pointer';
                              e.target.to({
                                shadowColor: !eraserMode ? (currentTheme?.colors?.accentPrimary || '#ff9dda') : '#9ca3af',
                                shadowBlur: 15,
                                shadowOpacity: 0.6,
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
                            text="Pen"
                            fontSize={stageSize.width < 600 ? 10 : 11}
                            fontFamily={currentFont}
                            fontStyle="500"
                            fill={!eraserMode ? 'white' : '#6b7280'}
                            width={stageSize.width < 600 ? 50 : 58}
                            height={stageSize.width < 600 ? 26 : 30}
                            align="center"
                            verticalAlign="middle"
                            listening={false}
                          />
                        </Group>

                        {/* Eraser button */}
                        <Group x={stageSize.width < 600 ? 58 : 66}>
                          <Rect
                            id="freedraw-eraser"
                            width={stageSize.width < 600 ? 50 : 58}
                            height={stageSize.width < 600 ? 26 : 30}
                            fill={eraserMode
                              ? currentTheme?.colors?.accentPrimary || '#ff9dda'
                              : '#e5e7eb'}
                            cornerRadius={8}
                            onClick={() => setEraserMode(true)}
                            onTap={() => setEraserMode(true)}
                            onMouseEnter={(e) => {
                              const container = e.target.getStage().container();
                              container.style.cursor = 'pointer';
                              e.target.to({
                                shadowColor: eraserMode ? (currentTheme?.colors?.accentPrimary || '#ff9dda') : '#9ca3af',
                                shadowBlur: 15,
                                shadowOpacity: 0.6,
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
                            text="Eraser"
                            fontSize={stageSize.width < 600 ? 9 : 10}
                            fontFamily={currentFont}
                            fontStyle="500"
                            fill={eraserMode ? 'white' : '#6b7280'}
                            width={stageSize.width < 600 ? 50 : 58}
                            height={stageSize.width < 600 ? 26 : 30}
                            align="center"
                            verticalAlign="middle"
                            listening={false}
                          />
                        </Group>
                      </Group>

                      {/* Brush size label and preview */}
                      <Group y={stageSize.width < 600 ? 34 : 38}>
                        <Text
                          text={`${eraserMode ? 'Eraser' : 'Brush'} Size: ${brushSize}px`}
                          fontSize={stageSize.width < 600 ? 9 : 10}
                          fontFamily={currentFont}
                          fontStyle="500"
                          fill={currentTheme?.colors?.textSecondary || '#9d6b9e'}
                          listening={false}
                        />

                        {/* Brush size preview circle - positioned with more spacing */}
                        <Circle
                          x={stageSize.width < 600 ? 102 : 112}
                          y={stageSize.width < 600 ? 5 : 6}
                          radius={Math.max(brushSize / 2, 2)}
                          stroke={currentTheme?.colors?.textSecondary || '#9d6b9e'}
                          strokeWidth={2}
                          fill={eraserMode ? 'transparent' : (currentTheme?.colors?.textSecondary || '#9d6b9e')}
                          listening={false}
                        />

                        {/* Slider background track */}
                        <Rect
                          id="freedraw-slider-bg"
                          y={stageSize.width < 600 ? 16 : 18}
                          width={stageSize.width < 600 ? 110 : 125}
                          height={4}
                          fill="#e5e7eb"
                          cornerRadius={2}
                          listening={false}
                        />

                        {/* Slider filled track */}
                        <Rect
                          y={stageSize.width < 600 ? 16 : 18}
                          width={((brushSize - 1) / 19) * (stageSize.width < 600 ? 110 : 125)}
                          height={4}
                          fill={currentTheme?.colors?.accentPrimary || '#ff9dda'}
                          cornerRadius={2}
                          listening={false}
                        />

                        {/* Slider thumb */}
                        <Circle
                          id="freedraw-slider-thumb"
                          x={tempSliderPos !== null ? tempSliderPos : ((brushSize - 1) / 19) * (stageSize.width < 600 ? 110 : 125)}
                          y={stageSize.width < 600 ? 18 : 20}
                          radius={8}
                          fill="white"
                          stroke={currentTheme?.colors?.accentPrimary || '#ff9dda'}
                          strokeWidth={2}
                          shadowColor="black"
                          shadowBlur={4}
                          shadowOpacity={0.2}
                          draggable={true}
                          dragBoundFunc={(pos) => {
                            const minX = 0;
                            const maxX = stageSize.width < 600 ? 110 : 125;
                            const newX = Math.max(minX, Math.min(pos.x, maxX));
                            return {
                              x: newX,
                              y: stageSize.width < 600 ? 18 : 20
                            };
                          }}
                          onDragStart={() => {
                            setTempSliderPos(((brushSize - 1) / 19) * (stageSize.width < 600 ? 110 : 125));
                          }}
                          onDragMove={(e) => {
                            const x = e.target.x();
                            setTempSliderPos(x);
                            const maxX = stageSize.width < 600 ? 110 : 125;
                            const newBrushSize = Math.round((x / maxX) * 19) + 1;
                            setBrushSize(Math.max(1, Math.min(20, newBrushSize)));
                          }}
                          onDragEnd={() => {
                            setTempSliderPos(null);
                          }}
                          onMouseEnter={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = 'pointer';
                          }}
                          onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = 'default';
                          }}
                        />

                        {/* Clickable track to jump to position */}
                        <Rect
                          id="freedraw-slider-track"
                          y={stageSize.width < 600 ? 10 : 12}
                          width={stageSize.width < 600 ? 110 : 125}
                          height={16}
                          fill="transparent"
                          onClick={(e) => {
                            const stage = e.target.getStage();
                            const pointerPos = stage.getPointerPosition();
                            const groupPos = e.target.getAbsolutePosition();
                            const clickX = pointerPos.x - groupPos.x;
                            const maxX = stageSize.width < 600 ? 110 : 125;
                            const newBrushSize = Math.round((clickX / maxX) * 19) + 1;
                            setBrushSize(Math.max(1, Math.min(20, newBrushSize)));
                          }}
                          onTap={(e) => {
                            const stage = e.target.getStage();
                            const pointerPos = stage.getPointerPosition();
                            const groupPos = e.target.getAbsolutePosition();
                            const clickX = pointerPos.x - groupPos.x;
                            const maxX = stageSize.width < 600 ? 110 : 125;
                            const newBrushSize = Math.round((clickX / maxX) * 19) + 1;
                            setBrushSize(Math.max(1, Math.min(20, newBrushSize)));
                          }}
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
                    </Group>
                  )}
                </Group>
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
