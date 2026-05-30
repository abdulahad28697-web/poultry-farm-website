function formatDatePart(value) {
  return value.toString().padStart(2, '0');
}

export function generateOrderNumber() {
  const now = new Date();
  const dateSegment = `${now.getFullYear()}${formatDatePart(
    now.getMonth() + 1
  )}${formatDatePart(now.getDate())}`;
  const randomSegment = Math.floor(1000 + Math.random() * 9000);

  return `HF-ORD-${dateSegment}-${randomSegment}`;
}
