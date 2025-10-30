import { InstrumentType } from '../components/layout/Side';

export const getInstrumentLabel = (instrument: InstrumentType): string => {
  const labels: Record<InstrumentType, string> = {
    piano: '피아노',
    drum: '드럼',
    bass: '베이스',
    guitar: '기타',
    vocal: '보컬'
  };
  return labels[instrument];
};
