import { Metadata } from 'next';
import { themes } from '@/lib/themes';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const theme = themes[slug];
  const name = theme ? theme.name : slug;
  const color = theme ? theme.colors.primary : '#00FF41';
  const encodedName = encodeURIComponent(name);
  const encodedColor = encodeURIComponent(color);

  // We point the image URL to our dynamic OG route /og
  const ogImageUrl = `https://ben-10-os.vercel.app/og?alien=${encodedName}&color=${encodedColor}`;

  return {
    title: `${name} | OmnitrixOS`,
    description: `Access Kineceleran, Pyronite, and Tetramand DNA data for ${name} on OmnitrixOS.`,
    openGraph: {
      title: `${name} DNA Link Secured — OmnitrixOS`,
      description: `Analyze species, home world, and known abilities of ${name} on the premium interactive database.`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name} Omnitrix Profile Card`,
        },
      ],
      url: `https://ben-10-os.vercel.app/alien/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} DNA Link Secured — OmnitrixOS`,
      description: `Analyze species, home world, and known abilities of ${name} on the premium interactive database.`,
      images: [ogImageUrl],
    },
  };
}

export default async function AlienLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
