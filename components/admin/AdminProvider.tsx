"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { AdminContext } from "./AdminContext";

export function AdminProvider({ children, expectedPassword }: { children: React.ReactNode; expectedPassword: string }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const close = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) { setPassword(""); setError(""); }
  };

  const authenticate = (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== expectedPassword) { setError("비밀번호가 맞지 않습니다."); return; }
    setIsAdmin(true);
    close(false);
  };

  const openAdmin = () => setOpen(true);

  return <AdminContext.Provider value={{ isAdmin, openAdmin }}>
    {children}
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay admin-dialog-overlay" />
        <Dialog.Content className="admin-dialog" aria-describedby="admin-description">
          <div className="admin-dialog-icon">{isAdmin ? <ShieldCheck size={22} /> : <LockKeyhole size={22} />}</div>
          <Dialog.Title>{isAdmin ? "관리자 모드가 켜져 있습니다" : "관리자 모드"}</Dialog.Title>
          <Dialog.Description id="admin-description">
            {isAdmin ? "강의노트 본문을 눌러 바로 수정할 수 있습니다." : "강의노트를 수정하려면 비밀번호를 입력하세요."}
          </Dialog.Description>
          {isAdmin ? <div className="admin-dialog-actions">
            <button className="button" onClick={() => { setIsAdmin(false); close(false); }}>관리자 모드 종료</button>
            <Dialog.Close asChild><button className="button primary">계속 편집하기</button></Dialog.Close>
          </div> : <form onSubmit={authenticate} className="admin-login-form">
            <label htmlFor="admin-password">비밀번호</label>
            <input id="admin-password" type="password" inputMode="numeric" autoComplete="current-password" autoFocus value={password} onChange={event => { setPassword(event.target.value); setError(""); }} placeholder="비밀번호 입력" aria-invalid={Boolean(error)} />
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="button primary" type="submit">관리자 모드 시작</button>
          </form>}
          <Dialog.Close asChild><button className="icon-button admin-dialog-close" aria-label="관리자 창 닫기"><X size={18} /></button></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </AdminContext.Provider>;
}
