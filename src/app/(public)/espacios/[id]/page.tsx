import { SpaceDetailView } from '@/components/explorar/SpaceDetailView';
import { getPublicSpaceById } from '@/lib/public-spaces';

type SpaceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicSpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { id } = await params;
  const space = await getPublicSpaceById(id);

  return <SpaceDetailView space={space} />;
}
