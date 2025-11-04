import React from 'react';
import { useGrained } from '../../hooks/useGrained';

const PreviewGrain = ({ id }) => {
  useGrained(id, {
    grainOpacity: 0.09,
    grainDensity: 1,
    grainWidth: 1,
    grainHeight: 1,
  });
  return null;
};

export default PreviewGrain;
