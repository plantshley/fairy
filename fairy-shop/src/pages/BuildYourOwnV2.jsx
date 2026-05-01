import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Transformer, Rect, Text, Group, Circle } from 'react-konva';
import useImage from 'use-image';
import { Sparkle } from '../components/Sparkle';
import { ColorPicker } from '../components/ColorPicker';
import { getAssetPath } from '../utils/assetPath';
import { trackEvent } from '../utils/analytics';
import { smoothDrawingStroke } from '../utils/drawingSmoothing';

// Mobile bottom sheet components
import { MobileBottomSheet } from '../components/mobile/MobileBottomSheet';
import { MobileTabNavigation } from '../components/mobile/MobileTabNavigation';
import { MobileQuickActions } from '../components/mobile/MobileQuickActions';
import { BodyTypeTabContent } from '../components/mobile/BodyTypeTabContent';
import { FaceTabContent } from '../components/mobile/FaceTabContent';
import { BodyPartsTabContent } from '../components/mobile/BodyPartsTabContent';
import { ColorsTabContent } from '../components/mobile/ColorsTabContent';
import { EditTabContent } from '../components/mobile/EditTabContent';

// Body types with SVG files (using versions with "2" in filename for canvas)
const bodyTypes = [
  { id: 'kirarin', name: 'Kirarin', emoji: '🦄', svgPath: getAssetPath('/build-svgs/body-kirarin.svg') },
  { id: 'frootie', name: 'Toodie Frootie', emoji: '🍋', svgPath: getAssetPath('/build-svgs/body-frootie.svg') },
  { id: 'sylph', name: 'Sylph', emoji: '🦢', svgPath: getAssetPath('/build-svgs/body-sylph.svg') },
  { id: 'griffon', name: 'Griffon', emoji: '🦉', svgPath: getAssetPath('/build-svgs/body-griffon.svg') },
  { id: 'harpy', name: 'Harpy', emoji: '🦇', svgPath: getAssetPath('/build-svgs/body-harpy.svg') },
  { id: 'lovely', name: 'Lovely', emoji: '💖', svgPath: getAssetPath('/build-svgs/body-lovely.svg') },
  { id: 'imp', name: 'Imp', emoji: '🐾', svgPath: getAssetPath('/build-svgs/body-imp.svg') },
  { id: 'tenshi-point', name: 'Tenshi (pointy)', emoji: '🪽', svgPath: getAssetPath('/build-svgs/body-tenshi-point.svg') },
  { id: 'tenshi-round', name: 'Tenshi (round)', emoji: '😇', svgPath: getAssetPath('/build-svgs/body-tenshi-round.svg') },
];

// Parts to add (preview uses v1, canvas uses white2)
const parts = {
  eyes: [
    {
      id: 'acc-faceplate',
      name: 'Faceplate',
      previewPath: getAssetPath('/build-svgs/acc-faceplate.svg'),
      canvasPath: getAssetPath('/build-svgs/acc-faceplate.svg')
    },
    {
      id: 'acc-faceplate2',
      name: 'Faceplate 2',
      previewPath: getAssetPath('/build-svgs/acc-faceplate2.svg'),
      canvasPath: getAssetPath('/build-svgs/acc-faceplate2.svg')
    },
    {
      id: 'acc-faceplate3',
      name: 'Faceplate 3',
      previewPath: getAssetPath('/build-svgs/acc-faceplate3.svg'),
      canvasPath: getAssetPath('/build-svgs/acc-faceplate3.svg')
    },
    { id: 'facial-mouth', name: 'Mouth 1', previewPath: getAssetPath('/build-svgs/facial-mouth.svg'), canvasPath: getAssetPath('/build-svgs/facial-mouth.svg') },
    { id: 'facial-mouth2', name: 'Mouth 2', previewPath: getAssetPath('/build-svgs/facial-mouth2.svg'), canvasPath: getAssetPath('/build-svgs/facial-mouth2.svg') },
    { id: 'facial-mouth3', name: 'Mouth 3', previewPath: getAssetPath('/build-svgs/facial-mouth3.svg'), canvasPath: getAssetPath('/build-svgs/facial-mouth3.svg') },
    { id: 'facial_0', name: 'Face 1', previewPath: getAssetPath('/build-svgs/facial_0.svg'), canvasPath: getAssetPath('/build-svgs/facial_0.svg') },
    { id: 'facial_1', name: 'Face 2', previewPath: getAssetPath('/build-svgs/facial_1.svg'), canvasPath: getAssetPath('/build-svgs/facial_1.svg') },
    { id: 'facial_2', name: 'Face 3', previewPath: getAssetPath('/build-svgs/facial_2.svg'), canvasPath: getAssetPath('/build-svgs/facial_2.svg') },
    { id: 'facial_3', name: 'Face 4', previewPath: getAssetPath('/build-svgs/facial_3.svg'), canvasPath: getAssetPath('/build-svgs/facial_3.svg') },
    { id: 'facial_4', name: 'Face 5', previewPath: getAssetPath('/build-svgs/facial_4.svg'), canvasPath: getAssetPath('/build-svgs/facial_4.svg') },
    { id: 'facial_5', name: 'Face 6', previewPath: getAssetPath('/build-svgs/facial_5.svg'), canvasPath: getAssetPath('/build-svgs/facial_5.svg') },
    { id: 'facial_6', name: 'Face 7', previewPath: getAssetPath('/build-svgs/facial_6.svg'), canvasPath: getAssetPath('/build-svgs/facial_6.svg') },
    { id: 'facial_7', name: 'Face 8', previewPath: getAssetPath('/build-svgs/facial_7.svg'), canvasPath: getAssetPath('/build-svgs/facial_7.svg') },
    { id: 'facial_8', name: 'Face 9', previewPath: getAssetPath('/build-svgs/facial_8.svg'), canvasPath: getAssetPath('/build-svgs/facial_8.svg') },
    { id: 'facial_9', name: 'Face 10', previewPath: getAssetPath('/build-svgs/facial_9.svg'), canvasPath: getAssetPath('/build-svgs/facial_9.svg') },
    { id: 'facial_10', name: 'Face 11', previewPath: getAssetPath('/build-svgs/facial_10.svg'), canvasPath: getAssetPath('/build-svgs/facial_10.svg') },
    { id: 'facial_11', name: 'Face 12', previewPath: getAssetPath('/build-svgs/facial_11.svg'), canvasPath: getAssetPath('/build-svgs/facial_11.svg') },
    { id: 'facial_12', name: 'Face 13', previewPath: getAssetPath('/build-svgs/facial_12.svg'), canvasPath: getAssetPath('/build-svgs/facial_12.svg') },
    { id: 'facial_13', name: 'Face 14', previewPath: getAssetPath('/build-svgs/facial_13.svg'), canvasPath: getAssetPath('/build-svgs/facial_13.svg') },
    { id: 'facial_14', name: 'Face 15', previewPath: getAssetPath('/build-svgs/facial_14.svg'), canvasPath: getAssetPath('/build-svgs/facial_14.svg') },
    { id: 'facial_15', name: 'Face 16', previewPath: getAssetPath('/build-svgs/facial_15.svg'), canvasPath: getAssetPath('/build-svgs/facial_15.svg') },
    { id: 'facial_16', name: 'Face 17', previewPath: getAssetPath('/build-svgs/facial_16.svg'), canvasPath: getAssetPath('/build-svgs/facial_16.svg') },
    { id: 'facial_17', name: 'Face 18', previewPath: getAssetPath('/build-svgs/facial_17.svg'), canvasPath: getAssetPath('/build-svgs/facial_17.svg') },
    { id: 'facial_18', name: 'Face 19', previewPath: getAssetPath('/build-svgs/facial_18.svg'), canvasPath: getAssetPath('/build-svgs/facial_18.svg') },
    { id: 'facial_20', name: 'Face 20', previewPath: getAssetPath('/build-svgs/facial_20.svg'), canvasPath: getAssetPath('/build-svgs/facial_20.svg') },
    { id: 'facial_21', name: 'Face 21', previewPath: getAssetPath('/build-svgs/facial_21.svg'), canvasPath: getAssetPath('/build-svgs/facial_21.svg') },
    { id: 'facial_25', name: 'Face 22', previewPath: getAssetPath('/build-svgs/facial_25.svg'), canvasPath: getAssetPath('/build-svgs/facial_25.svg') },
    { id: 'facial_26', name: 'Face 23', previewPath: getAssetPath('/build-svgs/facial_26.svg'), canvasPath: getAssetPath('/build-svgs/facial_26.svg') },
    { id: 'facial_27', name: 'Face 24', previewPath: getAssetPath('/build-svgs/facial_27.svg'), canvasPath: getAssetPath('/build-svgs/facial_27.svg') },
    { id: 'facial_28', name: 'Face 25', previewPath: getAssetPath('/build-svgs/facial_28.svg'), canvasPath: getAssetPath('/build-svgs/facial_28.svg') },
    { id: 'facial_29', name: 'Face 26', previewPath: getAssetPath('/build-svgs/facial_29.svg'), canvasPath: getAssetPath('/build-svgs/facial_29.svg') },
    { id: 'facial_30', name: 'Face 27', previewPath: getAssetPath('/build-svgs/facial_30.svg'), canvasPath: getAssetPath('/build-svgs/facial_30.svg') },
    { id: 'facial_31', name: 'Face 28', previewPath: getAssetPath('/build-svgs/facial_31.svg'), canvasPath: getAssetPath('/build-svgs/facial_31.svg') },
    { id: 'eyes_2', name: 'Eyes 1', previewPath: getAssetPath('/build-svgs/eyes_2.svg'), canvasPath: getAssetPath('/build-svgs/eyes_2.svg') },
    { id: 'eyes_3', name: 'Eyes 2', previewPath: getAssetPath('/build-svgs/eyes_3.svg'), canvasPath: getAssetPath('/build-svgs/eyes_3.svg') },
    { id: 'eyes_4', name: 'Eyes 3', previewPath: getAssetPath('/build-svgs/eyes_4.svg'), canvasPath: getAssetPath('/build-svgs/eyes_4.svg') },
    { id: 'eyes_5', name: 'Eyes 4', previewPath: getAssetPath('/build-svgs/eyes_5.svg'), canvasPath: getAssetPath('/build-svgs/eyes_5.svg') },
    { id: 'eyes_6', name: 'Eyes 5', previewPath: getAssetPath('/build-svgs/eyes_6.svg'), canvasPath: getAssetPath('/build-svgs/eyes_6.svg') },
    { id: 'eyes_7', name: 'Eyes 6', previewPath: getAssetPath('/build-svgs/eyes_7.svg'), canvasPath: getAssetPath('/build-svgs/eyes_7.svg') },
    { id: 'eyes_8', name: 'Eyes 7', previewPath: getAssetPath('/build-svgs/eyes_8.svg'), canvasPath: getAssetPath('/build-svgs/eyes_8.svg') },
    { id: 'eyes_9', name: 'Eyes 8', previewPath: getAssetPath('/build-svgs/eyes_9.svg'), canvasPath: getAssetPath('/build-svgs/eyes_9.svg') },
    { id: 'eyes_10', name: 'Eyes 9', previewPath: getAssetPath('/build-svgs/eyes_10.svg'), canvasPath: getAssetPath('/build-svgs/eyes_10.svg') },
    { id: 'eyes_11', name: 'Eyes 10', previewPath: getAssetPath('/build-svgs/eyes_11.svg'), canvasPath: getAssetPath('/build-svgs/eyes_11.svg') },
    { id: 'eyes_12', name: 'Eyes 11', previewPath: getAssetPath('/build-svgs/eyes_12.svg'), canvasPath: getAssetPath('/build-svgs/eyes_12.svg') },
    { id: 'eyes_13', name: 'Eyes 12', previewPath: getAssetPath('/build-svgs/eyes_13.svg'), canvasPath: getAssetPath('/build-svgs/eyes_13.svg') },
    { id: 'eyes_14', name: 'Eyes 13', previewPath: getAssetPath('/build-svgs/eyes_14.svg'), canvasPath: getAssetPath('/build-svgs/eyes_14.svg') },
    { id: 'eyes_15', name: 'Eyes 14', previewPath: getAssetPath('/build-svgs/eyes_15.svg'), canvasPath: getAssetPath('/build-svgs/eyes_15.svg') },
    { id: 'eyes_16', name: 'Eyes 15', previewPath: getAssetPath('/build-svgs/eyes_16.svg'), canvasPath: getAssetPath('/build-svgs/eyes_16.svg') },
    { id: 'eyes_17', name: 'Eyes 16', previewPath: getAssetPath('/build-svgs/eyes_17.svg'), canvasPath: getAssetPath('/build-svgs/eyes_17.svg') },
    { id: 'facial_32', name: 'Face 29', previewPath: getAssetPath('/build-svgs/facial_32.svg'), canvasPath: getAssetPath('/build-svgs/facial_32.svg') },
    { id: 'facial_33', name: 'Face 30', previewPath: getAssetPath('/build-svgs/facial_33.svg'), canvasPath: getAssetPath('/build-svgs/facial_33.svg') },
    { id: 'facial_34', name: 'Face 31', previewPath: getAssetPath('/build-svgs/facial_34.svg'), canvasPath: getAssetPath('/build-svgs/facial_34.svg') },
    { id: 'facial_35', name: 'Face 32', previewPath: getAssetPath('/build-svgs/facial_35.svg'), canvasPath: getAssetPath('/build-svgs/facial_35.svg') },
    { id: 'facial_36', name: 'Face 33', previewPath: getAssetPath('/build-svgs/facial_36.svg'), canvasPath: getAssetPath('/build-svgs/facial_36.svg') },
    { id: 'facial_37', name: 'Face 34', previewPath: getAssetPath('/build-svgs/facial_37.svg'), canvasPath: getAssetPath('/build-svgs/facial_37.svg') },
    { id: 'facial_38', name: 'Face 35', previewPath: getAssetPath('/build-svgs/facial_38.svg'), canvasPath: getAssetPath('/build-svgs/facial_38.svg') },
    { id: 'facial_39', name: 'Face 36', previewPath: getAssetPath('/build-svgs/facial_39.svg'), canvasPath: getAssetPath('/build-svgs/facial_39.svg') },
    { id: 'facial_40', name: 'Face 37', previewPath: getAssetPath('/build-svgs/facial_40.svg'), canvasPath: getAssetPath('/build-svgs/facial_40.svg') },
    { id: 'facial_41', name: 'Face 38', previewPath: getAssetPath('/build-svgs/facial_41.svg'), canvasPath: getAssetPath('/build-svgs/facial_41.svg') },
    { id: 'facial_42', name: 'Face 39', previewPath: getAssetPath('/build-svgs/facial_42.svg'), canvasPath: getAssetPath('/build-svgs/facial_42.svg') },
    { id: 'facial_43', name: 'Face 40', previewPath: getAssetPath('/build-svgs/facial_43.svg'), canvasPath: getAssetPath('/build-svgs/facial_43.svg') },
    { id: 'facial_44', name: 'Face 41', previewPath: getAssetPath('/build-svgs/facial_44.svg'), canvasPath: getAssetPath('/build-svgs/facial_44.svg') },
    { id: 'facial_45', name: 'Face 42', previewPath: getAssetPath('/build-svgs/facial_45.svg'), canvasPath: getAssetPath('/build-svgs/facial_45.svg') },
    { id: 'facial_46', name: 'Face 43', previewPath: getAssetPath('/build-svgs/facial_46.svg'), canvasPath: getAssetPath('/build-svgs/facial_46.svg') },
    { id: 'facial_47', name: 'Face 44', previewPath: getAssetPath('/build-svgs/facial_47.svg'), canvasPath: getAssetPath('/build-svgs/facial_47.svg') },
    { id: 'facial_48', name: 'Face 45', previewPath: getAssetPath('/build-svgs/facial_48.svg'), canvasPath: getAssetPath('/build-svgs/facial_48.svg') },
    { id: 'facial_49', name: 'Face 46', previewPath: getAssetPath('/build-svgs/facial_49.svg'), canvasPath: getAssetPath('/build-svgs/facial_49.svg') },
    { id: 'facial_50', name: 'Face 47', previewPath: getAssetPath('/build-svgs/facial_50.svg'), canvasPath: getAssetPath('/build-svgs/facial_50.svg') },
    { id: 'facial_51', name: 'Face 48', previewPath: getAssetPath('/build-svgs/facial_51.svg'), canvasPath: getAssetPath('/build-svgs/facial_51.svg') },
    { id: 'eyes-sad-left', name: 'Sad Eye (L)', previewPath: getAssetPath('/build-svgs/eyes-sad-left.svg'), canvasPath: getAssetPath('/build-svgs/eyes-sad-left.svg') },
    { id: 'eyes-sad-right', name: 'Sad Eye (R)', previewPath: getAssetPath('/build-svgs/eyes-sad-right.svg'), canvasPath: getAssetPath('/build-svgs/eyes-sad-right.svg') },
  ],
  limbs: [
    {
      id: 'limbs-long',
      name: 'Long',
      previewPath: getAssetPath('/build-svgs/limbs-long.svg'),
      canvasPath: getAssetPath('/build-svgs/limbs-long.svg')
    },
    {
      id: 'limbs-long2',
      name: 'Long 2',
      previewPath: getAssetPath('/build-svgs/limbs-long2.svg'),
      canvasPath: getAssetPath('/build-svgs/limbs-long2.svg')
    },
    {
      id: 'limbs-med',
      name: 'Medium',
      previewPath: getAssetPath('/build-svgs/limbs-med.svg'),
      canvasPath: getAssetPath('/build-svgs/limbs-med.svg')
    },
    {
      id: 'limbs-short',
      name: 'Short',
      previewPath: getAssetPath('/build-svgs/limbs-short.svg'),
      canvasPath: getAssetPath('/build-svgs/limbs-short.svg')
    },
    {
      id: 'limbs-long-toes',
      name: 'Long Toes',
      previewPath: getAssetPath('/build-svgs/limbs-long-toes.svg'),
      canvasPath: getAssetPath('/build-svgs/limbs-long-toes.svg')
    },
    {
      id: 'limbs-short-toes',
      name: 'Short Toes',
      previewPath: getAssetPath('/build-svgs/limbs-short-toes.svg'),
      canvasPath: getAssetPath('/build-svgs/limbs-short-toes.svg')
    },
  ],
  accessories: [
    { id: 'acc-sparkle', name: 'Sparkle', previewPath: getAssetPath('/build-svgs/acc-sparkle.svg'), canvasPath: getAssetPath('/build-svgs/acc-sparkle.svg') },
    { id: 'acc-heart', name: 'Heart', previewPath: getAssetPath('/build-svgs/acc-heart.svg'), canvasPath: getAssetPath('/build-svgs/acc-heart.svg') },
    { id: 'acc-star', name: 'Star', previewPath: getAssetPath('/build-svgs/acc-star.svg'), canvasPath: getAssetPath('/build-svgs/acc-star.svg') },
    { id: 'acc-crown', name: 'Crown', previewPath: getAssetPath('/build-svgs/acc-crown.svg'), canvasPath: getAssetPath('/build-svgs/acc-crown.svg') },
    { id: 'acc-halo', name: 'Halo', previewPath: getAssetPath('/build-svgs/acc-halo.svg'), canvasPath: getAssetPath('/build-svgs/acc-halo.svg') },
    { id: 'acc-boot1', name: 'Boot 1', previewPath: getAssetPath('/build-svgs/acc-boot1.svg'), canvasPath: getAssetPath('/build-svgs/acc-boot1.svg') },
    { id: 'acc-boot2', name: 'Boot 2', previewPath: getAssetPath('/build-svgs/acc-boot2.svg'), canvasPath: getAssetPath('/build-svgs/acc-boot2.svg') },
    { id: 'acc-boot3', name: 'Boot 3', previewPath: getAssetPath('/build-svgs/acc-boot3.svg'), canvasPath: getAssetPath('/build-svgs/acc-boot3.svg') },
    { id: 'acc-frill', name: 'Frill', previewPath: getAssetPath('/build-svgs/acc-frill.svg'), canvasPath: getAssetPath('/build-svgs/acc-frill.svg') },
    { id: 'acc-frill2', name: 'Frill 2', previewPath: getAssetPath('/build-svgs/acc-frill2.svg'), canvasPath: getAssetPath('/build-svgs/acc-frill2.svg') },
    { id: 'acc_1', name: 'Acc 2', previewPath: getAssetPath('/build-svgs/acc_1.svg'), canvasPath: getAssetPath('/build-svgs/acc_1.svg') },
    { id: 'acc_2', name: 'Acc 3', previewPath: getAssetPath('/build-svgs/acc_2.svg'), canvasPath: getAssetPath('/build-svgs/acc_2.svg') },
    { id: 'acc_3', name: 'Acc 4', previewPath: getAssetPath('/build-svgs/acc_3.svg'), canvasPath: getAssetPath('/build-svgs/acc_3.svg') },
    { id: 'acc_4', name: 'Acc 5', previewPath: getAssetPath('/build-svgs/acc_4.svg'), canvasPath: getAssetPath('/build-svgs/acc_4.svg') },
    { id: 'acc_5', name: 'Acc 6', previewPath: getAssetPath('/build-svgs/acc_5.svg'), canvasPath: getAssetPath('/build-svgs/acc_5.svg') },
    { id: 'acc_6', name: 'Acc 7', previewPath: getAssetPath('/build-svgs/acc_6.svg'), canvasPath: getAssetPath('/build-svgs/acc_6.svg') },
    { id: 'acc_7', name: 'Acc 8', previewPath: getAssetPath('/build-svgs/acc_7.svg'), canvasPath: getAssetPath('/build-svgs/acc_7.svg') },
    { id: 'acc_8', name: 'Acc 9', previewPath: getAssetPath('/build-svgs/acc_8.svg'), canvasPath: getAssetPath('/build-svgs/acc_8.svg') },
    { id: 'acc_9', name: 'Acc 10', previewPath: getAssetPath('/build-svgs/acc_9.svg'), canvasPath: getAssetPath('/build-svgs/acc_9.svg') },
    { id: 'acc_10', name: 'Acc 11', previewPath: getAssetPath('/build-svgs/acc_10.svg'), canvasPath: getAssetPath('/build-svgs/acc_10.svg') },
    { id: 'acc_11', name: 'Acc 12', previewPath: getAssetPath('/build-svgs/acc_11.svg'), canvasPath: getAssetPath('/build-svgs/acc_11.svg') },
    { id: 'acc_12', name: 'Acc 13', previewPath: getAssetPath('/build-svgs/acc_12.svg'), canvasPath: getAssetPath('/build-svgs/acc_12.svg') },
    { id: 'acc_13', name: 'Acc 14', previewPath: getAssetPath('/build-svgs/acc_13.svg'), canvasPath: getAssetPath('/build-svgs/acc_13.svg') },
    { id: 'acc_14', name: 'Acc 15', previewPath: getAssetPath('/build-svgs/acc_14.svg'), canvasPath: getAssetPath('/build-svgs/acc_14.svg') },
    { id: 'acc_15', name: 'Acc 16', previewPath: getAssetPath('/build-svgs/acc_15.svg'), canvasPath: getAssetPath('/build-svgs/acc_15.svg') },
    { id: 'acc_16', name: 'Acc 17', previewPath: getAssetPath('/build-svgs/acc_16.svg'), canvasPath: getAssetPath('/build-svgs/acc_16.svg') },
    { id: 'acc_20', name: 'Acc 18', previewPath: getAssetPath('/build-svgs/acc_20.svg'), canvasPath: getAssetPath('/build-svgs/acc_20.svg') },
    { id: 'acc_21', name: 'Acc 19', previewPath: getAssetPath('/build-svgs/acc_21.svg'), canvasPath: getAssetPath('/build-svgs/acc_21.svg') },
    { id: 'acc_22', name: 'Acc 20', previewPath: getAssetPath('/build-svgs/acc_22.svg'), canvasPath: getAssetPath('/build-svgs/acc_22.svg') },
    { id: 'acc_23', name: 'Acc 21', previewPath: getAssetPath('/build-svgs/acc_23.svg'), canvasPath: getAssetPath('/build-svgs/acc_23.svg') },
    { id: 'acc_24', name: 'Acc 22', previewPath: getAssetPath('/build-svgs/acc_24.svg'), canvasPath: getAssetPath('/build-svgs/acc_24.svg') },
    { id: 'acc_25', name: 'Acc 23', previewPath: getAssetPath('/build-svgs/acc_25.svg'), canvasPath: getAssetPath('/build-svgs/acc_25.svg') },
    { id: 'acc_28', name: 'Acc 24', previewPath: getAssetPath('/build-svgs/acc_28.svg'), canvasPath: getAssetPath('/build-svgs/acc_28.svg') },
  ],
  earsWingsTails: [
    { id: 'ear6', name: 'Ear 6', previewPath: getAssetPath('/build-svgs/ear6.svg'), canvasPath: getAssetPath('/build-svgs/ear6.svg') },
    { id: 'ear1', name: 'Ear 1', previewPath: getAssetPath('/build-svgs/ear1.svg'), canvasPath: getAssetPath('/build-svgs/ear1.svg') },
    { id: 'ear2', name: 'Ear 2', previewPath: getAssetPath('/build-svgs/ear2.svg'), canvasPath: getAssetPath('/build-svgs/ear2.svg') },
    { id: 'ear3', name: 'Ear 3', previewPath: getAssetPath('/build-svgs/ear3.svg'), canvasPath: getAssetPath('/build-svgs/ear3.svg') },
    { id: 'ear4', name: 'Ear 4', previewPath: getAssetPath('/build-svgs/ear4.svg'), canvasPath: getAssetPath('/build-svgs/ear4.svg') },
    { id: 'ear5', name: 'Ear 5', previewPath: getAssetPath('/build-svgs/ear5.svg'), canvasPath: getAssetPath('/build-svgs/ear5.svg') },
    { id: 'wings-angel', name: 'Angel Wings', previewPath: getAssetPath('/build-svgs/wings-angel.svg'), canvasPath: getAssetPath('/build-svgs/wings-angel.svg') },
    { id: 'wings-bat', name: 'Bat Wings', previewPath: getAssetPath('/build-svgs/wings-bat.svg'), canvasPath: getAssetPath('/build-svgs/wings-bat.svg') },
    { id: 'wings-butterfly', name: 'Butterfly Wings', previewPath: getAssetPath('/build-svgs/wings-butterfly.svg'), canvasPath: getAssetPath('/build-svgs/wings-butterfly.svg') },
    { id: 'wings-butterfly2', name: 'Butterfly Wings 2', previewPath: getAssetPath('/build-svgs/wings-butterfly2.svg'), canvasPath: getAssetPath('/build-svgs/wings-butterfly2.svg') },
    { id: 'acc-horn1', name: 'Horn 1', previewPath: getAssetPath('/build-svgs/acc-horn1.svg'), canvasPath: getAssetPath('/build-svgs/acc-horn1.svg') },
    { id: 'acc-horn2', name: 'Horn 2', previewPath: getAssetPath('/build-svgs/acc-horn2.svg'), canvasPath: getAssetPath('/build-svgs/acc-horn2.svg') },
    { id: 'acc-horn3', name: 'Horn 3', previewPath: getAssetPath('/build-svgs/acc-horn3.svg'), canvasPath: getAssetPath('/build-svgs/acc-horn3.svg') },
    { id: 'acc-horn4', name: 'Horn 4', previewPath: getAssetPath('/build-svgs/acc-horn4.svg'), canvasPath: getAssetPath('/build-svgs/acc-horn4.svg') },
    { id: 'tail1', name: 'Tail 1', previewPath: getAssetPath('/build-svgs/tail1.svg'), canvasPath: getAssetPath('/build-svgs/tail1.svg') },
    { id: 'tail2', name: 'Tail 2', previewPath: getAssetPath('/build-svgs/tail2.svg'), canvasPath: getAssetPath('/build-svgs/tail2.svg') },
    { id: 'tail3', name: 'Tail 3', previewPath: getAssetPath('/build-svgs/tail3.svg'), canvasPath: getAssetPath('/build-svgs/tail3.svg') },
    { id: 'tail4', name: 'Tail 4', previewPath: getAssetPath('/build-svgs/tail4.svg'), canvasPath: getAssetPath('/build-svgs/tail4.svg') },
  ],
};

// Body SVG component with color filter
const BodyImage = ({ body, x, y, onClick, stageSize, bodySizeMultiplier }) => {
  const [image] = useImage(body.svgPath);
  const [filterImage, setFilterImage] = useState(null);

  // Calculate responsive body size - use bodySizeMultiplier prop
  const screenSize = Math.min(stageSize.width, stageSize.height);
  const isDesktop = window.innerWidth >= 1024; // lg breakpoint
  const baseSizeMultiplier = isDesktop ? 0.85 : 0.92;
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
  const dragStartPos = useRef(null);
  const isDragging = useRef(false);

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

    // Trash is in UI layer at these screen space coordinates (centered on the trash icon)
    const trashX = 30;  // x=10 + width/2 (40/2)
    const trashY = stageSize.height - 30;  // y + height/2

    const distance = Math.sqrt(Math.pow(screenX - trashX, 2) + Math.pow(screenY - trashY, 2));
    // Smaller detection radius to prevent accidental deletions
    const detectionRadius = Math.min(25 + (Math.max(scale - 1, 0) * 30), 60);
    return distance < detectionRadius;
  };

  const bufferSize = 10; // 10px buffer on each side for easier selection

  return (
    <>
      <Group
        ref={shapeRef}
        x={object.x}
        y={object.y}
        scaleX={(object.scaleX || 1) * (object.flipped ? -1 : 1)}
        scaleY={object.scaleY || 1}
        rotation={object.rotation || 0}
        draggable={!freeDrawMode}
        onClick={freeDrawMode ? undefined : onSelect}
        onTap={freeDrawMode ? undefined : onSelect}
        onDragStart={freeDrawMode ? undefined : (e) => {
          dragStartPos.current = { x: e.target.x(), y: e.target.y() };
          isDragging.current = false;
          if (onDragStart) onDragStart();
        }}
        onDragMove={(e) => {
          if (freeDrawMode || !dragStartPos.current) return;

          const currentX = e.target.x();
          const currentY = e.target.y();
          const dx = currentX - dragStartPos.current.x;
          const dy = currentY - dragStartPos.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only enable dragging if moved more than 3 pixels
          // (low threshold so finger drags register reliably on mobile)
          if (distance > 3) {
            isDragging.current = true;
          }

          // If not yet marked as dragging, prevent movement
          if (!isDragging.current) {
            e.target.position(dragStartPos.current);
          }
        }}
        onDragEnd={(e) => {
          if (freeDrawMode) return;

          // If drag didn't meet threshold, reset position and don't process as drag
          if (!isDragging.current && dragStartPos.current) {
            e.target.position(dragStartPos.current);
            dragStartPos.current = null;
            return;
          }

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

          dragStartPos.current = null;
          isDragging.current = false;
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
      >
        {/* Invisible hit area for easier mobile selection */}
        <Rect
          x={0}
          y={0}
          width={croppedDimensions.width + (bufferSize * 2)}
          height={croppedDimensions.height + (bufferSize * 2)}
          offsetX={(croppedDimensions.width + (bufferSize * 2)) / 2}
          offsetY={(croppedDimensions.height + (bufferSize * 2)) / 2}
          fill="transparent"
        />
        <KonvaImage
          image={filterImage || image}
          x={0}
          y={0}
          width={croppedDimensions.width}
          height={croppedDimensions.height}
          offsetX={croppedDimensions.width / 2}
          offsetY={croppedDimensions.height / 2}
          listening={false}
        />
      </Group>
      {isSelected && !freeDrawMode && (
        <Transformer
          ref={trRef}
          borderStroke={currentTheme?.colors?.accentPrimary || '#ff9dda'}
          anchorStroke={currentTheme?.colors?.accentPrimary || '#ff9dda'}
          anchorFill={currentTheme?.colors?.accentSecondary || '#c5a3ff'}
          borderStrokeWidth={2}
          anchorSize={14}
          anchorCornerRadius={2}
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

export const BuildYourOwnV2 = ({ currentTheme }) => {
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedBody, setSelectedBody] = useState(null);
  const [placedObjects, setPlacedObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [currentOutlineColor, setCurrentOutlineColor] = useState('#000000');
  const [recentColors, setRecentColors] = useState(['#ffffff', '#000000', '#ff69b4', '#c5a3ff', '#89cff0']);
  const [activeColorTarget, setActiveColorTarget] = useState('drawing'); // 'bodyColor' | 'bodyOutline' | 'objectColor' | 'objectOutline' | 'drawing'
  const [freeDrawMode, setFreeDrawMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  // lines: each entry has { points, color, size, eraser, groupId, zIndex }.
  // groupId identifies a "drawing instance" — strokes made between enabling
  // and disabling free-draw mode. Each group has its own zIndex so it can be
  // layered independently of other drawings and objects.
  const [lines, setLines] = useState([]);
  // Tracks the drawing group currently being built. Cleared when free-draw is
  // disabled so the next session starts a fresh group.
  const currentDrawGroupRef = useRef(null);
  const [brushSize, setBrushSize] = useState(5);
  const [tempSliderPos, setTempSliderPos] = useState(null);
  const [trashHovered, setTrashHovered] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
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

  // Mobile bottom sheet state
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [bottomSheetState, setBottomSheetState] = useState('half');
  const [mobileActiveTab, setMobileActiveTab] = useState('bodyType');

  const stageRef = useRef(null);
  const containerRef = useRef(null);
  // Refs to track current zoom/pan state for smooth touch gestures
  const stageScaleRef = useRef(1);
  const stagePositionRef = useRef({ x: 0, y: 0 });
  // Ref to throttle brush size updates with requestAnimationFrame
  const brushSizeUpdateRef = useRef(null);
  // Ref to track touch/mouse down position to distinguish tap from scroll
  const mouseDownPos = useRef(null);
  const [trashImage] = useImage(getAssetPath('/trash.png'));
  const [visualisImage] = useImage(getAssetPath('/visualis.png'));
  const [undoImage] = useImage(getAssetPath('/icons/refresh-data.png'));

  // Get current font from CSS variable - recompute when body class changes
  const [currentFont, setCurrentFont] = useState('JetBrains Mono, monospace');

  // Preload all part images on mount for faster loading
  useEffect(() => {
    const allParts = [
      ...parts.eyes,
      ...parts.limbs,
      ...parts.accessories,
      ...parts.earsWingsTails,
    ];

    allParts.forEach((part) => {
      const img = new Image();
      img.src = part.previewPath;
    });
  }, []);

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

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fairyBuilderState');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.selectedBody) setSelectedBody(state.selectedBody);
        if (state.placedObjects) setPlacedObjects(state.placedObjects);
        if (state.lines) setLines(state.lines);
        if (state.bodySizeMultiplier) setBodySizeMultiplier(state.bodySizeMultiplier);
        if (state.currentColor) setCurrentColor(state.currentColor);
        if (state.brushSize) setBrushSize(state.brushSize);
        // Don't restore zoom/pan state to avoid duplication bug
        // Always start with default zoom/pan
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
  }, []);

  // Mobile layout detection
  useEffect(() => {
    const checkMobile = () => {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      // < 1024 (lg) so tablets like iPad Air (820w portrait) get the mobile
      // bottom-sheet layout instead of the cramped desktop sidebar.
      const isSmall = window.innerWidth < 1024;
      setIsMobileLayout(isPortrait && isSmall);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Close out the active drawing instance whenever free-draw is turned off,
  // so the next time it's enabled, a new layer is created.
  useEffect(() => {
    if (!freeDrawMode) currentDrawGroupRef.current = null;
  }, [freeDrawMode]);

  // Save state to localStorage
  const handleSaveDesign = () => {
    try {
      const state = {
        selectedBody,
        placedObjects,
        lines,
        bodySizeMultiplier,
        currentColor,
        brushSize,
        timestamp: Date.now(),
      };
      localStorage.setItem('fairyBuilderState', JSON.stringify(state));

      // Track creature save
      trackEvent('creature_saved', {
        object_count: placedObjects.length,
        has_body: !!selectedBody,
        has_drawing: lines.length > 0,
      });

      alert('Design saved! ✨');
    } catch (e) {
      console.error('Failed to save state:', e);
      alert('Failed to save design. Please try again.');
    }
  };


  // Handle responsive canvas sizing
  useEffect(() => {
    let lastWidth = window.innerWidth;
    let initialHeight = null;

    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        // Store initial height on first load to prevent changes from mobile address bar
        if (initialHeight === null) {
          initialHeight = window.innerHeight - 200;
        }

        setStageSize({
          width: Math.min(containerWidth, 800),
          height: Math.max(initialHeight, 400),
        });
      }
    };

    const handleResize = () => {
      // Only update if width changed (actual rotation/resize), not height (mobile address bar)
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        // Reset initial height on orientation change
        initialHeight = null;
        updateSize();
      }
    };

    updateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Save current state to history
  const saveToHistory = () => {
    setHistory([...history, {
      placedObjects: [...placedObjects],
      lines: [...lines],
      selectedBody: selectedBody ? { ...selectedBody } : null,
      bodySizeMultiplier,
    }]);
    // Clear redo history when new changes are made
    setRedoHistory([]);
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;

    // Save current state to redo history before undoing
    setRedoHistory([...redoHistory, {
      placedObjects: [...placedObjects],
      lines: [...lines],
      selectedBody: selectedBody ? { ...selectedBody } : null,
      bodySizeMultiplier,
    }]);

    const lastState = history[history.length - 1];
    setPlacedObjects(lastState.placedObjects);
    setLines(lastState.lines);
    setSelectedBody(lastState.selectedBody);
    if (lastState.bodySizeMultiplier !== undefined) {
      setBodySizeMultiplier(lastState.bodySizeMultiplier);
    }
    setHistory(history.slice(0, -1));
    setSelectedId(null);
  };

  // Redo last undone action
  const handleRedo = () => {
    if (redoHistory.length === 0) return;

    // Save current state to history before redoing
    setHistory([...history, {
      placedObjects: [...placedObjects],
      lines: [...lines],
      selectedBody: selectedBody ? { ...selectedBody } : null,
      bodySizeMultiplier,
    }]);

    const lastRedoState = redoHistory[redoHistory.length - 1];
    setPlacedObjects(lastRedoState.placedObjects);
    setLines(lastRedoState.lines);
    setSelectedBody(lastRedoState.selectedBody);
    if (lastRedoState.bodySizeMultiplier !== undefined) {
      setBodySizeMultiplier(lastRedoState.bodySizeMultiplier);
    }
    setRedoHistory(redoHistory.slice(0, -1));
    setSelectedId(null);
  };

  const handleBodySelect = (body) => {
    setHistory(prev => [...prev, {
      placedObjects: placedObjects,
      lines: lines,
      selectedBody: selectedBody ? { ...selectedBody } : null,
    }]);
    setSelectedBody({ ...body, color: body.color || '#ffffff' });

    // Track body selection
    trackEvent('body_selected', {
      body_type: body.id,
      body_name: body.name,
    });

    // Set default body size based on screen width if not already set
    if (bodySizeMultiplier === null) {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      setBodySizeMultiplier(isMobile ? 0.92 : 0.85); // Larger on both mobile and desktop
    }
  };

  const handleAddObject = (part) => {
    setHistory(prev => [...prev, {
      placedObjects: placedObjects,
      lines: lines,
      selectedBody: selectedBody ? { ...selectedBody } : null,
    }]);

    // Calculate responsive initial size
    const screenSize = Math.min(stageSize.width, stageSize.height);
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint
    // Identify part types
    const isFaceplate = part.id.startsWith('acc-faceplate');
    const isFacial = part.id.startsWith('facial');
    const isAccessory = part.id.startsWith('acc-');
    const isLimb = part.id.startsWith('limbs-');
    const isEarWingTail = part.id.startsWith('ear') || part.id.startsWith('tail');
    const isBiggerPart = isAccessory || isLimb || isEarWingTail;

    // Determine initial size based on part type
    let initialSize;
    if (isFaceplate) {
      // Faceplates should be large
      initialSize = isDesktop ? screenSize * 0.25 : screenSize * 0.30;
    } else if (isLimb) {
      // Limbs are much smaller
      initialSize = isDesktop ? screenSize * 0.1 : screenSize * 0.15;
    } else if (isFacial) {
      // Facial features smaller for all screen sizes
      initialSize = isDesktop ? screenSize * 0.12 : screenSize * 0.14;
    } else {
      // Other accessories
      initialSize = isDesktop
        ? (isBiggerPart ? screenSize * 0.12 : screenSize * 0.18)
        : (isBiggerPart ? screenSize * 0.1 : screenSize * 0.18);
    }

    const newObject = {
      id: `${part.id}-${Date.now()}`,
      type: part.id,
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      svgPath: part.canvasPath,
      rotation: 0,
      width: initialSize,
      height: initialSize,
      scaleX: 1.3,
      scaleY: 1.3,
      flipped: false,
      color: currentColor,
      outlineColor: currentOutlineColor,
      zIndex: 1, // Start above body but BEHIND drawings; user can "Move to Front" (zIndex=10) to put it in front of drawings
    };
    setPlacedObjects(prev => [...prev, newObject]);
  };

  const handleFlipObject = () => {
    if (selectedId) {
      saveToHistory();
      setPlacedObjects(prev =>
        prev.map((obj) =>
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

    const currentZ = placedObjects[index].zIndex || 0;

    // Build a list of all stack items (other objects + drawing groups), so we
    // can move past whichever item happens to be the next neighbor in zIndex
    // order — including drawings.
    const drawingGroupZs = new Map();
    for (const line of lines) {
      const z = line.zIndex !== undefined ? line.zIndex : 0;
      const id = line.groupId || 'legacy';
      if (!drawingGroupZs.has(id)) drawingGroupZs.set(id, z);
    }
    const otherZs = [
      ...placedObjects
        .filter(o => o.id !== selectedId)
        .map(o => o.zIndex || 0),
      ...drawingGroupZs.values(),
    ];

    let newZ = currentZ;
    if (direction === 'up') {
      const above = otherZs.filter(z => z >= currentZ).sort((a, b) => a - b)[0];
      newZ = above !== undefined ? above + 1 : currentZ + 1;
    } else if (direction === 'down') {
      const below = otherZs.filter(z => z <= currentZ).sort((a, b) => b - a)[0];
      newZ = below !== undefined ? below - 1 : currentZ - 1;
    } else if (direction === 'front') {
      const max = otherZs.length ? Math.max(...otherZs) : 0;
      newZ = max + 1;
    } else if (direction === 'back') {
      const min = otherZs.length ? Math.min(...otherZs) : 0;
      newZ = min - 1;
    }

    const newObjects = [...placedObjects];
    newObjects[index] = { ...newObjects[index], zIndex: newZ };
    setPlacedObjects(newObjects);
  };

  const handleObjectChange = (id, newAttrs) => {
    setPlacedObjects(prev =>
      prev.map((obj) => (obj.id === id ? newAttrs : obj))
    );
  };

  const handleTransformStart = () => {
    saveToHistory();
  };

  const handleDragStart = () => {
    saveToHistory();
  };

  // Track recently used colors (max 10, most recent first)
  const addRecentColor = (color) => {
    const normalized = color.slice(0, 7).toLowerCase(); // Strip alpha, normalize
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== normalized);
      return [normalized, ...filtered].slice(0, 10);
    });
  };

  const handleColorChange = (newColor) => {
    setActiveColorTarget('objectColor');
    setCurrentColor(newColor);
    addRecentColor(newColor);
    if (selectedId) {
      const currentSelectedId = selectedId; // Capture current value
      saveToHistory();
      setPlacedObjects(prev =>
        prev.map((obj) =>
          obj.id === currentSelectedId ? { ...obj, color: newColor } : obj
        )
      );
    }
  };

  const handleObjectOutlineColorChange = (newColor) => {
    setActiveColorTarget('objectOutline');
    setCurrentOutlineColor(newColor);
    addRecentColor(newColor);
    if (selectedId) {
      const currentSelectedId = selectedId; // Capture current value
      saveToHistory();
      setPlacedObjects(prev =>
        prev.map((obj) =>
          obj.id === currentSelectedId ? { ...obj, outlineColor: newColor } : obj
        )
      );
    }
  };

  const handleBodyColorChange = (newColor) => {
    setActiveColorTarget('bodyColor');
    addRecentColor(newColor);
    if (selectedBody) {
      saveToHistory();
      setSelectedBody({ ...selectedBody, color: newColor });
    }
  };

  const handleBodyOutlineColorChange = (newColor) => {
    setActiveColorTarget('bodyOutline');
    addRecentColor(newColor);
    if (selectedBody) {
      saveToHistory();
      setSelectedBody({ ...selectedBody, outlineColor: newColor });
    }
  };

  const handleRecentColorClick = (color) => {
    switch (activeColorTarget) {
      case 'bodyColor':
        handleBodyColorChange(color);
        break;
      case 'bodyOutline':
        handleBodyOutlineColorChange(color);
        break;
      case 'objectOutline':
        handleObjectOutlineColorChange(color);
        break;
      case 'objectColor':
        handleColorChange(color);
        break;
      case 'drawing':
      default:
        setCurrentColor(color);
        addRecentColor(color);
        break;
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
      ? Math.min(oldScale * scaleBy, 5) // Max zoom 5x
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
      ? Math.min(oldScale * scaleBy, 5)
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
        newScale = Math.max(0.5, Math.min(newScale, 10));

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

  // Note: Removed global touch scroll prevention as it was too broad and prevented
  // scrolling on the control panel and clicking buttons on mobile.
  // The canvas handles touch events properly through Konva's touch handlers.

  const handleMouseDown = (e) => {
    // Prevent default touch behavior to avoid scrolling
    if (e.evt && e.evt.type && e.evt.type.startsWith('touch')) {
      e.evt.preventDefault();
    }

    // Track mouse/touch down position
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    mouseDownPos.current = { x: pos.x, y: pos.y, time: Date.now() };

    // Check if clicking on the undo button (let it handle its own click)
    const clickedNode = e.target;
    if (clickedNode.attrs && clickedNode.attrs.id === 'undo-button') {
      return;
    }

    // Check if clicking on free draw controls (prevent drawing on the controls)
    if (clickedNode.attrs && clickedNode.attrs.id && clickedNode.attrs.id.startsWith('freedraw-')) {
      return;
    }

    // Check if clicking on canvas control buttons (zoom, pan, reset)
    if (clickedNode.attrs && clickedNode.attrs.id && clickedNode.attrs.id.startsWith('canvas-button-')) {
      return;
    }

    if (!freeDrawMode) {
      // Don't deselect here - wait for mouseup to check if it was a tap
      return;
    }

    // Don't start drawing if it's a multi-touch gesture (pinch-to-zoom)
    if (e.evt && e.evt.touches && e.evt.touches.length > 1) {
      return;
    }

    // Don't start drawing immediately - wait a tiny bit to see if a second finger comes down
    // This prevents the initial dot when starting a pinch-to-zoom gesture
    const touchTimeout = setTimeout(() => {
      // Double-check we're still in single-touch mode
      if (e.evt && e.evt.touches && e.evt.touches.length > 1) {
        return;
      }

      saveToHistory();
      setIsDrawing(true);
      // Transform pointer position to account for zoom and pan
      const transformedX = (pos.x - stagePosition.x) / stageScale;
      const transformedY = (pos.y - stagePosition.y) / stageScale;

      // Start a new drawing instance (group) on the first stroke after
      // entering free-draw mode. Its zIndex sits above everything currently
      // on the canvas so the new drawing renders on top.
      if (!currentDrawGroupRef.current) {
        const allZ = [
          ...placedObjects.map(o => o.zIndex || 0),
          ...lines.map(l => (l.zIndex !== undefined ? l.zIndex : 0)),
        ];
        const maxZ = allZ.length ? Math.max(...allZ) : 0;
        currentDrawGroupRef.current = {
          id: `draw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          zIndex: maxZ + 1,
        };
      }
      const { id: groupId, zIndex } = currentDrawGroupRef.current;

      setLines([...lines, {
        points: [transformedX, transformedY],
        color: currentColor,
        size: brushSize,
        eraser: eraserMode,
        groupId,
        zIndex,
      }]);
    }, 50); // 50ms delay to detect multi-touch

    // Store timeout so we can cancel it if needed
    if (!mouseDownPos.current.touchTimeout) {
      mouseDownPos.current.touchTimeout = touchTimeout;
    }
  };

  const handleMouseMove = (e) => {
    // Prevent default touch behavior to avoid scrolling
    if (e.evt && e.evt.type && e.evt.type.startsWith('touch')) {
      e.evt.preventDefault();
    }

    // Cancel pending draw timeout if multi-touch is detected
    if (e.evt && e.evt.touches && e.evt.touches.length > 1) {
      if (mouseDownPos.current && mouseDownPos.current.touchTimeout) {
        clearTimeout(mouseDownPos.current.touchTimeout);
        mouseDownPos.current.touchTimeout = null;
      }

      // Stop drawing if already started
      if (isDrawing) {
        setIsDrawing(false);
        // Remove the line that was just started
        setLines(lines.slice(0, -1));
      }
      return;
    }

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

  const handleMouseUp = (e) => {
    // Prevent default touch behavior to avoid scrolling
    if (e.evt && e.evt.type && e.evt.type.startsWith('touch')) {
      e.evt.preventDefault();
    }

    // Clear any pending draw timeout
    if (mouseDownPos.current && mouseDownPos.current.touchTimeout) {
      clearTimeout(mouseDownPos.current.touchTimeout);
    }

    // Smooth the last line if we were drawing
    if (isDrawing && lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      if (lastLine.points.length >= 6) {
        // Apply smoothing to the completed stroke
        const smoothedPoints = smoothDrawingStroke(lastLine.points);
        const smoothedLine = { ...lastLine, points: smoothedPoints };
        setLines([...lines.slice(0, -1), smoothedLine]);
      }
    }

    setIsDrawing(false);

    // Check if this was a tap (not a scroll/drag) to deselect
    if (!freeDrawMode && mouseDownPos.current) {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const dx = pos.x - mouseDownPos.current.x;
      const dy = pos.y - mouseDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDiff = Date.now() - mouseDownPos.current.time;

      // Only deselect if it was a tap (< 5px movement, < 300ms duration) on empty space
      const wasTap = distance < 5 && timeDiff < 300;
      const clickedOnEmpty = e.target === stage;

      if (wasTap && clickedOnEmpty) {
        setSelectedId(null);
      }
    }

    mouseDownPos.current = null;
  };

  const handleClear = () => {
    if (!window.confirm('Are you sure you want to clear everything? This will delete your current design and any saved progress.')) {
      return;
    }
    saveToHistory();
    setPlacedObjects([]);
    setLines([]);
    setSelectedBody(null);
    setSelectedId(null);
    // Also clear saved state
    try {
      localStorage.removeItem('fairyBuilderState');
    } catch (e) {
      console.error('Failed to clear saved state:', e);
    }
  };

  const handleExport = () => {
    // Track export event
    trackEvent('creature_exported', {
      object_count: placedObjects.length,
      has_drawing: lines.length > 0,
      has_body: !!selectedBody,
    });

    // Get only the content layers (first three layers), excluding UI controls layer (fourth layer)
    const stage = stageRef.current;
    const contentLayer1 = stage.children[0]; // Layer 1: Objects behind body and drawings
    const drawingLayer = stage.children[1]; // Layer 2: Free Draw Lines
    const contentLayer2 = stage.children[2]; // Layer 3: Objects in front of drawings
    const uiLayer = stage.children[3]; // Layer 4: UI controls - will be hidden during export

    // Calculate bounding box of all content with generous padding
    const contentGroup = contentLayer1.getChildren().find(child => child !== undefined);
    if (!contentGroup) return;

    // Get bounds of all visible content
    const box1 = contentLayer1.getClientRect({ skipTransform: false });
    const drawBox = drawingLayer.getClientRect({ skipTransform: false });
    const box2 = contentLayer2.getClientRect({ skipTransform: false });

    // Collect only non-empty boxes (ignore layers with no content)
    const boxes = [box1, drawBox, box2].filter(box => box.width > 0 && box.height > 0);

    if (boxes.length === 0) return; // Nothing to export

    // Merge only the non-empty bounding boxes
    const x = Math.min(...boxes.map(box => box.x));
    const y = Math.min(...boxes.map(box => box.y));
    const x2 = Math.max(...boxes.map(box => box.x + box.width));
    const y2 = Math.max(...boxes.map(box => box.y + box.height));
    const width = x2 - x;
    const height = y2 - y;

    // Debug: Log bounding box info
    console.log('Bounding box:', { x, y, width, height, x2, y2 });
    console.log('Canvas size:', stageSize);
    console.log('Box1:', box1);
    console.log('DrawBox:', drawBox);
    console.log('Box2:', box2);

    // Add very minimal padding - just enough to not clip edges
    const padding = 20;

    // Export the actual content dimensions (not forced to square)
    const exportWidth = width + (padding * 2);
    const exportHeight = height + (padding * 2);

    // Position at content bounds with padding
    const exportX = x - padding;
    const exportY = y - padding;

    console.log('Export dimensions:', { exportX, exportY, exportWidth, exportHeight });

    // Hide UI layer before export
    if (uiLayer) {
      uiLayer.hide();
    }

    // Export with tight crop around actual content
    const uri = stage.toDataURL({
      pixelRatio: 3, // 3x resolution for crisp, high-quality export
      mimeType: 'image/png', // PNG for lossless quality
      x: exportX,
      y: exportY,
      width: exportWidth,
      height: exportHeight,
    });

    // Show UI layer again after export
    if (uiLayer) {
      uiLayer.show();
    }

    const link = document.createElement('a');
    link.download = 'my-creature.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-20 lg:pb-4 overflow-hidden relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="font-kalnia text-xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 gradient-text text-center relative z-10"
        style={{ overflow: 'visible' }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Sparkle count={15} />
        ˗ˏˋ★ kirametki designer ★ˎˊ˗
      </motion.h1>

      <p className="text-center mb-2 sm:mb-4 text-sm sm:text-base md:text-lg lg:text-xl font-bonbon tracking-wider px-4" style={{ color: 'var(--text-primary)' }}>
        ⋆｡°✩ build your own kirametki creature ✩°｡⋆
      </p>

      <div className="flex flex-col landscape:flex-row lg:flex-row gap-4 w-full max-w-7xl flex-1">
        {/* Left Control Panel - hidden on mobile when using bottom sheet */}
        {!isMobileLayout && (
        <motion.div
          className="backdrop-blur-md rounded-3xl p-4 shadow-xl landscape:w-64 lg:w-64 flex-shrink-0 overflow-y-auto"
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
                      onMouseDown={() => saveToHistory()}
                      onTouchStart={() => saveToHistory()}
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
              <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-4 gap-1 sm:gap-2">
                {parts.eyes.map((part) => (
                  <button
                    key={part.id}
                    className="p-0.5 sm:p-2 rounded-lg sm:rounded-2xl transition-all hover:scale-110 shadow-sm sm:shadow-md aspect-square flex items-center justify-center"
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
              <div className="grid grid-cols-4 sm:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-2">
                {parts.limbs.map((part) => (
                  <button
                    key={part.id}
                    className="p-0.5 sm:p-2 rounded-lg sm:rounded-2xl transition-all hover:scale-110 shadow-sm sm:shadow-md aspect-square flex items-center justify-center"
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
              <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-4 gap-1 sm:gap-2">
                {parts.accessories.map((part) => (
                  <button
                    key={part.id}
                    className="p-0.5 sm:p-2 rounded-lg sm:rounded-2xl transition-all hover:scale-110 shadow-sm sm:shadow-md aspect-square flex items-center justify-center"
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
              <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-4 gap-1 sm:gap-2">
                {parts.earsWingsTails.map((part) => (
                  <button
                    key={part.id}
                    className="p-0.5 sm:p-2 rounded-lg sm:rounded-2xl transition-all hover:scale-110 shadow-sm sm:shadow-md aspect-square flex items-center justify-center"
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

          {/* Selected Object Controls - Desktop/Landscape */}
          {selectedId && (
            <div className="mb-6 hidden portrait:max-md:hidden md:block">
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
                    onClick={() => handleMoveLayer('up')}
                  >
                     ⬆ Send Forward
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('down')}
                  >
                     ⬇ Send Backward
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('front')}
                  >
                    ⏫ To Front
                  </button>
                  <button
                    className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 text-left"
                    style={{
                      background: 'var(--bg-gradient-start)',
                      color: 'var(--text-primary)',
                    }}
                    onClick={() => handleMoveLayer('back')}
                  >
                    ⏬ To Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Colors - Desktop/Landscape */}
          <div className="mb-6 space-y-2 hidden portrait:max-md:hidden md:block">
            <h3 className="font-bonbon tracking-wider text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Colors</h3>

            {/* Recent Colors - above pickers */}
            {recentColors.length > 0 && (
              <div className="mb-2 p-2 rounded-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                <span className="text-xs font-medium block text-center mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Recent Colors
                </span>
                <div className="grid grid-cols-5 gap-1.5 justify-items-center max-w-[10rem] mx-auto">
                  {recentColors.slice(0, 10).map((rc) => (
                    <button
                      key={rc}
                      type="button"
                      className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-125"
                      style={{
                        backgroundColor: rc,
                        borderColor: rc === '#ffffff' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                      }}
                      onClick={() => handleRecentColorClick(rc)}
                      title={rc}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Body colors - always shown */}
            <ColorPicker
              color={selectedBody?.color || '#ff69b4'}
              onChange={handleBodyColorChange}
              onActivate={() => setActiveColorTarget('bodyColor')}
              label="Body Color"
            />

            <ColorPicker
              color={selectedBody?.outlineColor || '#000000'}
              onChange={handleBodyOutlineColorChange}
              onActivate={() => setActiveColorTarget('bodyOutline')}
              label="Body Outline"
            />

            {/* Object colors - only shown when object is selected */}
            {selectedId && (
              <>
                <ColorPicker
                  color={placedObjects.find(obj => obj.id === selectedId)?.color || currentColor}
                  onChange={handleColorChange}
                  onActivate={() => setActiveColorTarget('objectColor')}
                  label="Object Color"
                />

                <ColorPicker
                  color={placedObjects.find(obj => obj.id === selectedId)?.outlineColor || '#000000'}
                  onChange={handleObjectOutlineColorChange}
                  onActivate={() => setActiveColorTarget('objectOutline')}
                  label="Object Outline"
                />
              </>
            )}
          </div>

          {/* Colors & Object - Mobile Portrait Only */}
          <div className="mb-6 space-y-2 portrait:max-md:block md:hidden">
            <h3 className="font-bonbon tracking-wider text-xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>Colors & Object</h3>

            {/* Body Color with Duplicate button */}
            <div className="flex items-center justify-between gap-2">
              <ColorPicker
                color={selectedBody?.color || '#ff69b4'}
                onChange={handleBodyColorChange}
                label="Body Color"
              />
              <button
                className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 whitespace-nowrap ml-auto"
                style={{
                  background: 'var(--bg-gradient-start)',
                  color: 'var(--text-primary)',
                  opacity: selectedId ? 1 : 0.5,
                }}
                onClick={handleDuplicateObject}
                disabled={!selectedId}
              >
                📋 Duplicate
              </button>
            </div>

            {/* Body Outline with To Front button */}
            <div className="flex items-center justify-between gap-2">
              <ColorPicker
                color={selectedBody?.outlineColor || '#000000'}
                onChange={handleBodyOutlineColorChange}
                label="Body Outline"
              />
              <button
                className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 whitespace-nowrap ml-auto"
                style={{
                  background: 'var(--bg-gradient-start)',
                  color: 'var(--text-primary)',
                  opacity: selectedId ? 1 : 0.5,
                }}
                onClick={() => handleMoveLayer('up')}
                disabled={!selectedId}
              >
                ⬆ Forward
              </button>
            </div>

            {/* Object/Drawing Color with To Back button */}
            <div className="flex items-center justify-between gap-2">
              <ColorPicker
                color={placedObjects.find(obj => obj.id === selectedId)?.color || currentColor}
                onChange={handleColorChange}
                label="Object & Drawing Color"
              />
              <button
                className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 whitespace-nowrap ml-auto"
                style={{
                  background: 'var(--bg-gradient-start)',
                  color: 'var(--text-primary)',
                  opacity: selectedId ? 1 : 0.5,
                }}
                onClick={() => handleMoveLayer('down')}
                disabled={!selectedId}
              >
                ⬇ Backward
              </button>
            </div>

            {/* Object Outline with Flip button */}
            <div className="flex items-center justify-between gap-2">
              <ColorPicker
                color={placedObjects.find(obj => obj.id === selectedId)?.outlineColor || '#000000'}
                onChange={handleObjectOutlineColorChange}
                label="Object Outline"
              />
              <button
                className="py-1 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105 whitespace-nowrap ml-auto"
                style={{
                  background: 'var(--bg-gradient-start)',
                  color: 'var(--text-primary)',
                  opacity: selectedId ? 1 : 0.5,
                }}
                onClick={handleFlipObject}
                disabled={!selectedId}
              >
                ↔️ Flip
              </button>
            </div>
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
                background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
                color: 'white',
              }}
              onClick={handleSaveDesign}
            >
              ✨ Save & Continue
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
        )}

        {/* Canvas Area */}
        <motion.div
          ref={containerRef}
          className="backdrop-blur-md rounded-3xl shadow-xl p-4 overflow-hidden"
          style={{
            backgroundColor: currentTheme?.id === 'midnightVelvetMeadow' ? 'rgba(42, 16, 53, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            minHeight: isMobileLayout ? 'calc(50vh - 80px)' : '500px',
            flex: 1,
            touchAction: 'none', // Prevent touch scrolling
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ touchAction: 'none' }}
          >
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
                cursor: isPanning ? 'grabbing' : (spacePressed || panMode) ? 'grab' : 'default',
                touchAction: 'none', // Prevent touch scrolling on canvas
              }}
            >
              {/* Bottom: objects with zIndex < 0 render behind the body */}
              <Layer>
                {placedObjects
                  .filter(obj => (obj.zIndex || 0) < 0)
                  .slice()
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((obj) => (
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

                {/* Body */}
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
              </Layer>

              {/* Above the body: objects (zIndex >= 0) and drawing groups
                  interleaved by zIndex. Each drawing group renders in its own
                  Konva Layer (so the eraser scoping via destination-out only
                  affects strokes within that group), with listening={false}
                  so taps pass through to objects underneath. Consecutive
                  objects share a single layer for performance. */}
              {(() => {
                // Collect drawing groups from the lines array.
                const groupMap = new Map();
                for (const line of lines) {
                  const id = line.groupId || 'legacy';
                  if (!groupMap.has(id)) {
                    groupMap.set(id, {
                      groupId: id,
                      zIndex: line.zIndex !== undefined ? line.zIndex : 0,
                      lines: [],
                    });
                  }
                  groupMap.get(id).lines.push(line);
                }

                const items = [
                  ...placedObjects
                    .filter(obj => (obj.zIndex || 0) >= 0)
                    .map(obj => ({ kind: 'object', z: obj.zIndex || 0, data: obj })),
                  ...Array.from(groupMap.values())
                    .map(g => ({ kind: 'drawing', z: g.zIndex, data: g })),
                ].sort((a, b) => a.z - b.z);

                // Group consecutive objects so they share a layer.
                const layers = [];
                let pendingObjects = null;
                const flush = () => {
                  if (pendingObjects && pendingObjects.length) {
                    layers.push({ kind: 'objects', items: pendingObjects });
                  }
                  pendingObjects = null;
                };
                for (const item of items) {
                  if (item.kind === 'object') {
                    if (!pendingObjects) pendingObjects = [];
                    pendingObjects.push(item.data);
                  } else {
                    flush();
                    layers.push({ kind: 'drawing', group: item.data });
                  }
                }
                flush();

                return layers.map((layer, i) => {
                  if (layer.kind === 'drawing') {
                    return (
                      <Layer key={`draw-${layer.group.groupId}`} listening={false}>
                        {layer.group.lines.map((line, j) => (
                          <Line
                            key={j}
                            points={line.points}
                            stroke={line.color}
                            strokeWidth={line.size}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            globalCompositeOperation={line.eraser ? 'destination-out' : 'source-over'}
                          />
                        ))}
                      </Layer>
                    );
                  }
                  return (
                    <Layer key={`obj-${i}`}>
                      {layer.items.map((obj) => (
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
                  );
                });
              })()}

              {/* Layer 4: UI Controls (NOT exported) */}
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
                    id="canvas-button-pan"
                    x={stageSize.width - (stageSize.width < 400 ? 180 : stageSize.width < 600 ? 205 : 230)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    x={stageSize.width - (stageSize.width < 400 ? 180 : stageSize.width < 600 ? 205 : 230)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    id="canvas-button-zoom-in"
                    x={stageSize.width - (stageSize.width < 400 ? 140 : stageSize.width < 600 ? 155 : 175)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    x={stageSize.width - (stageSize.width < 400 ? 140 : stageSize.width < 600 ? 155 : 175)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    id="canvas-button-zoom-out"
                    x={stageSize.width - (stageSize.width < 400 ? 100 : stageSize.width < 600 ? 110 : 120)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    x={stageSize.width - (stageSize.width < 400 ? 100 : stageSize.width < 600 ? 110 : 120)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    id="canvas-button-reset"
                    x={stageSize.width - (stageSize.width < 400 ? 60 : stageSize.width < 600 ? 65 : 65)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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
                    x={stageSize.width - (stageSize.width < 400 ? 60 : stageSize.width < 600 ? 65 : 65)}
                    y={15}
                    width={stageSize.width < 600 ? 32 : 45}
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

                {/* Trash Can Icon - positioned in bottom-left, smaller and closer to edge */}
                {trashImage && (
                  <KonvaImage
                    image={trashImage}
                    x={10}
                    y={stageSize.height - 50}
                    width={40}
                    height={40}
                    opacity={0.7}
                    listening={false}
                  />
                )}

                {/* Undo Button - positioned in bottom-right, smaller and closer to edge */}
                {undoImage && (
                  <KonvaImage
                    id="undo-button"
                    image={undoImage}
                    x={stageSize.width - 50}
                    y={stageSize.height - 50}
                    width={40}
                    height={40}
                    opacity={history.length > 0 ? 1 : 0.3}
                    listening={history.length > 0}
                    onClick={(e) => {
                      e.cancelBubble = true;
                      handleUndo();
                    }}
                    onTap={(e) => {
                      e.cancelBubble = true;
                      handleUndo();
                    }}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                      e.target.to({
                        shadowColor: currentTheme?.colors?.accentPrimary || '#ff9dda',
                        shadowBlur: 20,
                        shadowOpacity: 0.8,
                        duration: 0.2,
                      });
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
                        const newMode = !freeDrawMode;
                        setFreeDrawMode(newMode);
                        if (newMode) {
                          trackEvent('drawing_mode_enabled');
                          setEraserMode(false);
                        }
                        if (!newMode) setEraserMode(false);
                      }}
                      onTap={() => {
                        const newMode = !freeDrawMode;
                        setFreeDrawMode(newMode);
                        if (newMode) {
                          trackEvent('drawing_mode_enabled');
                          setEraserMode(false);
                        }
                        if (!newMode) setEraserMode(false);
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
                            const clampedSize = Math.max(1, Math.min(20, newBrushSize));

                            // Throttle brush size updates using requestAnimationFrame
                            if (brushSizeUpdateRef.current) {
                              cancelAnimationFrame(brushSizeUpdateRef.current);
                            }
                            brushSizeUpdateRef.current = requestAnimationFrame(() => {
                              setBrushSize(clampedSize);
                              brushSizeUpdateRef.current = null;
                            });
                          }}
                          onDragEnd={() => {
                            // Cancel any pending updates
                            if (brushSizeUpdateRef.current) {
                              cancelAnimationFrame(brushSizeUpdateRef.current);
                              brushSizeUpdateRef.current = null;
                            }
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

          {!selectedBody && placedObjects.length === 0 && lines.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {visualisImage && (
                  <img
                    src={getAssetPath('/visualis.png')}
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

      {/* Mobile Bottom Sheet UI */}
      {isMobileLayout && (
        <MobileBottomSheet
          currentState={bottomSheetState}
          onStateChange={setBottomSheetState}
          theme={currentTheme}
        >
          {/* Quick Actions now inside sheet header */}
          <MobileQuickActions
            onExport={handleExport}
            onSave={handleSaveDesign}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            canUndo={history.length > 0}
            canRedo={redoHistory.length > 0}
            theme={currentTheme}
          />

          <MobileTabNavigation
            activeTab={mobileActiveTab}
            onTabChange={setMobileActiveTab}
            hasSelectedObject={selectedId !== null}
            theme={currentTheme}
          />

            <div className="overflow-y-auto" style={{
              maxHeight: bottomSheetState === 'full'
                ? 'calc(85vh - 140px)'  // Account for drag handle + quick actions + tab nav
                : bottomSheetState === 'half'
                ? 'calc(50vh - 140px)'
                : 'calc(60px - 140px)'  // Collapsed (essentially hidden)
            }}>
              {mobileActiveTab === 'bodyType' && (
                <BodyTypeTabContent
                  bodyTypes={bodyTypes}
                  selectedBody={selectedBody}
                  bodySizeMultiplier={bodySizeMultiplier}
                  onBodySelect={handleBodySelect}
                  onSizeChange={setBodySizeMultiplier}
                  onHistorySave={saveToHistory}
                  theme={currentTheme}
                />
              )}

              {mobileActiveTab === 'face' && (
                <FaceTabContent
                  parts={parts}
                  onAddObject={handleAddObject}
                  theme={currentTheme}
                />
              )}

              {mobileActiveTab === 'bodyParts' && (
                <BodyPartsTabContent
                  parts={parts}
                  onAddObject={handleAddObject}
                  theme={currentTheme}
                />
              )}

              {mobileActiveTab === 'colors' && (
                <ColorsTabContent
                  selectedBody={selectedBody}
                  selectedId={selectedId}
                  placedObjects={placedObjects}
                  currentColor={currentColor}
                  onBodyColorChange={handleBodyColorChange}
                  onBodyOutlineColorChange={handleBodyOutlineColorChange}
                  onObjectColorChange={(newColor, isOutline) => {
                    if (isOutline) {
                      handleObjectOutlineColorChange(newColor);
                    } else {
                      handleColorChange(newColor);
                    }
                  }}
                  onDrawingColorChange={(newColor) => {
                    setActiveColorTarget('drawing');
                    setCurrentColor(newColor);
                    addRecentColor(newColor);
                  }}
                  onHistorySave={saveToHistory}
                  recentColors={recentColors}
                  onRecentColorClick={handleRecentColorClick}
                  onSetActiveTarget={setActiveColorTarget}
                  theme={currentTheme}
                />
              )}

              {mobileActiveTab === 'edit' && (
                <EditTabContent
                  selectedId={selectedId}
                  onFlip={handleFlipObject}
                  onDuplicate={handleDuplicateObject}
                  onBringForward={() => handleMoveLayer('up')}
                  onSendBackward={() => handleMoveLayer('down')}
                  onMoveToFront={() => handleMoveLayer('front')}
                  onMoveToBack={() => handleMoveLayer('back')}
                  onDelete={() => {
                    setPlacedObjects(placedObjects.filter((o) => o.id !== selectedId));
                    setSelectedId(null);
                  }}
                  theme={currentTheme}
                />
              )}
            </div>
          </MobileBottomSheet>
      )}
    </motion.div>
  );
};
