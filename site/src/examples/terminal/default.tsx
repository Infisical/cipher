import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Terminal, type TerminalHandle, type TerminalStatus } from "@infisical/cipher/ui/terminal";

const prompt = "\x1b[32mubuntu@prod-bastion\x1b[0m:\x1b[34m~\x1b[0m$ ";
const banner = [
  "Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 6.8.0-1015-aws x86_64)",
  "",
  "Last login: Sat Nov 14 09:12:44 2026 from 10.0.4.17",
  prompt + "ls -la /etc/app",
  "total 24",
  "drwxr-xr-x  3 root root 4096 Nov 14 09:10 \x1b[34m.\x1b[0m",
  "drwxr-xr-x 98 root root 4096 Nov 12 18:02 \x1b[34m..\x1b[0m",
  "-rw-r-----  1 root app   812 Nov 14 09:10 config.yaml",
  "-rwxr-xr-x  1 root app  2190 Nov 13 21:44 \x1b[32mhealthcheck.sh\x1b[0m",
  "drwxr-x---  2 root app  4096 Nov 14 09:10 \x1b[34mtls\x1b[0m",
  prompt + "systemctl is-active app",
  "\x1b[32mactive\x1b[0m",
  ""
].join("\r\n");

const commands: Record<string, string> = {
  whoami: "ubuntu",
  hostname: "prod-bastion",
  uptime: " 09:14:02 up 12 days,  3:41,  1 user,  load average: 0.08, 0.05, 0.01",
  help: "Try whoami, hostname, uptime, clear or exit."
};

export default function Example() {
  const terminal = React.useRef<TerminalHandle>(null);
  const line = React.useRef("");
  const [status, setStatus] = React.useState<TerminalStatus>("connecting");
  const [message, setMessage] = React.useState<string>();

  const connect = React.useCallback(() => {
    setMessage(undefined);
    setStatus("connecting");
    line.current = "";
    terminal.current?.reset();
    const timer = window.setTimeout(() => {
      terminal.current?.write(banner + prompt);
      setStatus("connected");
    }, 600);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => connect(), [connect]);

  const end = (reason: string) => {
    setMessage(reason);
    setStatus("disconnected");
  };

  const onData = (data: string) => {
    if (status !== "connected") return;
    const out = terminal.current;
    if (data === "\r") {
      const command = line.current.trim();
      line.current = "";
      out?.write("\r\n");
      if (command === "exit") return end("The remote host closed the session.");
      if (command === "clear") return out?.write("\x1b[2J\x1b[H" + prompt);
      if (command) out?.write((commands[command] ?? `${command}: command not found`) + "\r\n");
      out?.write(prompt);
    } else if (data === "\x7f") {
      if (!line.current) return;
      line.current = line.current.slice(0, -1);
      out?.write("\b \b");
    } else if (data >= " ") {
      line.current += data;
      out?.write(data);
    }
  };

  return (
    <Terminal
      ref={terminal}
      label="ubuntu@prod-bastion"
      status={status}
      message={message}
      onRetry={connect}
      onData={onData}
      className="h-96"
      actions={
        status === "connected" && (
          <Button variant="ghost" onClick={() => end("You disconnected the session.")}>
            Disconnect
          </Button>
        )
      }
    />
  );
}
