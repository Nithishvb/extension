import { HIRO_INSCRIPTIONS_API_URL } from '@shared/constants';
import {
  Inscription,
  SupportedInscription,
  whenInscriptionType,
} from '@shared/models/inscription.model';

import { useGetInscriptionQuery } from './inscription.query';

export function createInscriptionInfoUrl(id: string) {
  return `https://ordinals.hiro.so/inscription/${id}`;
}

function createHtmlPreviewUrl(id: string) {
  return `https://ordinals.com/preview/${id}`;
}

export function convertInscriptionToSupportedInscriptionType(inscription: Inscription) {
  const title = `Inscription ${inscription.number}`;
  return whenInscriptionType<SupportedInscription>(inscription.content_type, {
    audio: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      src: createHtmlPreviewUrl(inscription.id),
      type: 'audio',
      title,
      ...inscription,
    }),
    html: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      src: createHtmlPreviewUrl(inscription.id),
      type: 'html',
      title,
      ...inscription,
    }),
    image: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      src: `${HIRO_INSCRIPTIONS_API_URL}/${inscription.id}/content`,
      type: 'image',
      title,
      ...inscription,
    }),
    text: () => ({
      contentSrc: `${HIRO_INSCRIPTIONS_API_URL}/${inscription.id}/content`,
      infoUrl: createInscriptionInfoUrl(inscription.id),
      type: 'text',
      title,
      ...inscription,
    }),
    video: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      src: createHtmlPreviewUrl(inscription.id),
      type: 'video',
      title,
      ...inscription,
    }),
    other: () => ({
      infoUrl: createInscriptionInfoUrl(inscription.id),
      type: 'other',
      title,
      ...inscription,
    }),
  });
}

export function useInscription(id: string) {
  return useGetInscriptionQuery(id, {
    select: resp => convertInscriptionToSupportedInscriptionType(resp),
  });
}
