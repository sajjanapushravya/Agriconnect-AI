import React from 'react';
import { FarmerDeliveryPlanView } from './farmer/FarmerDeliveryPlanView';

export const DeliveryPlan: React.FC<{ onBack?: () => void }> = ({ onBack = () => {} }) => {
  return <FarmerDeliveryPlanView onBack={onBack} />;
};

export default DeliveryPlan;
