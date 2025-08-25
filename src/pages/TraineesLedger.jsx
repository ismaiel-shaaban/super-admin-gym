import React from 'react';
import { useParams } from 'react-router-dom';
import TraineesLedgerList from './TraineesLedgerList';
import TraineesLedgerIndividual from './TraineesLedgerIndividual';

const TraineesLedger = () => {
  const { traineeId } = useParams();

  // Render list view if no traineeId, otherwise render individual view
  return traineeId ? <TraineesLedgerIndividual /> : <TraineesLedgerList />;
};

export default TraineesLedger;
