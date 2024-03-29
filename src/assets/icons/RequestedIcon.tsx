function RequestedIcon({ width, height }: { width: string; height: string }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24">
      <path
        d="M4.51555 7C3.55827 8.4301 3 10.1499 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3V6M12 12L8 8"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default RequestedIcon;
