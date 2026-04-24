import { getGuestCredits, estimateFreeListingsLeft } from '@/src/billing/credits';
import { describeMode } from '@/src/domain/modes';
import type { ListingMode } from '@/src/domain/types';
import { useAuthStore } from '@/src/state/authStore';
import { useSessionStore } from '@/src/state/sessionStore';
import { PrimaryButton } from '@/src/ui/components/PrimaryButton';
import { Screen } from '@/src/ui/components/Screen';
import { useRouter } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const reset = useSessionStore((s) => s.reset);
  const userId = useAuthStore((s) => s.userId);
  const [guestCredits, setGuestCredits] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    if (userId) {
      setGuestCredits(null);
      return;
    }
    void getGuestCredits().then((value) => {
      if (active) setGuestCredits(value);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const startVehicle = () => {
    reset();
    router.push('/vehicle/vin');
  };

  const startItem = (mode: Exclude<ListingMode, 'auto'>) => {
    reset();
    router.push({ pathname: '/item/capture', params: { mode } });
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.logo}>ListForge</Text>
        <Text style={styles.tagline}>Guided photos → instant marketplace copy.</Text>
        {!userId && guestCredits != null ? (
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerTitle}>
              Free listings left: {estimateFreeListingsLeft(guestCredits)}
            </Text>
            <Text style={styles.guestBannerBody}>
              You have {guestCredits.toFixed(1)} free credits. We show exact usage before each listing.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cards}>
        <ModeCard
          title={describeMode('auto').label}
          hint={describeMode('auto').hint}
          action={<PrimaryButton label="Start vehicle flow" onPress={startVehicle} />}
        />
        <ModeCard
          title={describeMode('electronics').label}
          hint={describeMode('electronics').hint}
          action={<PrimaryButton label="Add photos" onPress={() => startItem('electronics')} />}
        />
        <ModeCard
          title={describeMode('general').label}
          hint={describeMode('general').hint}
          action={<PrimaryButton label="Add photos" onPress={() => startItem('general')} />}
        />
      </View>
    </Screen>
  );
}

function ModeCard({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardHint}>{hint}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 18, gap: 18 },
  hero: { gap: 8, marginTop: 8 },
  logo: { color: '#fff', fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 22 },
  guestBanner: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 10,
    gap: 4,
  },
  guestBannerTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  guestBannerBody: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 17 },
  cards: { gap: 14, marginTop: 8 },
  card: {
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  cardHint: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 20 },
});
