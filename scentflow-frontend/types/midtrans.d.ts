interface MidtransSnap {
  pay(
    token: string,
    options: {
      onSuccess?: () => void;
      onPending?: () => void;
      onError?: () => void;
    },
  ): void;
}

interface Window {
  snap: MidtransSnap;
}
