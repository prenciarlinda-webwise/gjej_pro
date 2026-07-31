/**
 * Renders one or more schema.org objects as <script type="application/ld+json">
 * tags. JSON.stringify escapes `<` as needed isn't automatic, so we manually
 * escape "</" to prevent the script tag from being closed early by embedded
 * content (e.g. a bio or review containing "</script>").
 */
export function JsonLd({
  data,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Array<Record<string, any>>;
}) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
