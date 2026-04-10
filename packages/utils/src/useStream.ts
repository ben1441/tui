import { useState, useEffect } from 'react';

export function useStream(stream: NodeJS.ReadableStream) {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const handleData = (chunk: Buffer) => {
      setData((prev) => {
        const newLines = chunk.toString().split('\n');
        // keep last 100 lines for memory safety
        const updated = [...prev, ...newLines];
        if (updated.length > 100) {
          return updated.slice(updated.length - 100);
        }
        return updated;
      });
    };

    stream.on('data', handleData);
    return () => {
      stream.off('data', handleData);
    };
  }, [stream]);

  return data;
}
