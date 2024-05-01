import BarcodeScanner from "@/components/BarcodeScanner";

export default async function ProductChecker() {
  const successCallback = async (result: string) => {
      "use server"
  }

  return (
  <main className="flex min-h-screen flex-col items-center justify-between">
    <BarcodeScanner onScan={successCallback} />
  </main>
  );
}
