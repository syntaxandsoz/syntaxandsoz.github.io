export default function Disclaimer() {
  return (
    <div className="mt-8 p-4 border border-[var(--error)] bg-[var(--error)]/10 rounded-md text-sm">
      <h3 className="text-[var(--error)] font-bold mb-2 uppercase">Security & Privacy Notice</h3>
      <p className="opacity-90">
        All operations (encryption, steganography, rendering) are performed entirely client-side in your browser. 
        No data, payloads, or files are ever transmitted to or stored on our servers. 
        Ensure you are on a trusted network and verify the source code if required. 
        Use these tools responsibly and in compliance with applicable laws.
      </p>
    </div>
  );
}
