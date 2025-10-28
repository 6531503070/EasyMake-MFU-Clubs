"use client";

import { useCallback } from "react";

export type MemberInput = {
  full_name: string;
  email: string;
  citizen_id: string;
};

type ClubEditFormSectionProps = {
  editClubName: string;
  setEditClubName: (v: string) => void;

  editLeaderName: string;
  setEditLeaderName: (v: string) => void;

  editLeaderEmail: string;
  setEditLeaderEmail: (v: string) => void;

  editLeaderCitizenId: string;
  setEditLeaderCitizenId: (v: string) => void;

  editMembers: MemberInput[];
  setEditMembers: (next: MemberInput[] | ((prev: MemberInput[]) => MemberInput[])) => void;

  editSubmitting: boolean;
  editError: string;
};

export function ClubEditFormSection({
  editClubName,
  setEditClubName,
  editLeaderName,
  setEditLeaderName,
  editLeaderEmail,
  setEditLeaderEmail,
  editLeaderCitizenId,
  setEditLeaderCitizenId,
  editMembers,
  setEditMembers,
  editSubmitting,
  editError,
}: ClubEditFormSectionProps) {
  const updateEditMember = useCallback(
    (idx: number, field: keyof MemberInput, value: string) => {
      setEditMembers((prev) => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], [field]: value };
        return copy;
      });
    },
    [setEditMembers]
  );

  const addEditMemberRow = useCallback(() => {
    setEditMembers((prev) => [
      ...prev,
      { full_name: "", email: "", citizen_id: "" },
    ]);
  }, [setEditMembers]);

  const removeEditMemberRow = useCallback(
    (idx: number) => {
      setEditMembers((prev) => prev.filter((_, i) => i !== idx));
    },
    [setEditMembers]
  );

  return (
    <div className="space-y-6 text-[13px]">
      {editError && (
        <div className="text-[12px] rounded-md px-3 py-2 border bg-red-50 text-red-700 border-red-200">
          {editError}
        </div>
      )}

      <div className="space-y-4">
        <div className="text-[13px] font-semibold text-gray-800">
          Club Information
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Club Name
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={editClubName}
              onChange={(e) => setEditClubName(e.target.value)}
              required
              disabled={editSubmitting}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Leader Full Name
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={editLeaderName}
              onChange={(e) => setEditLeaderName(e.target.value)}
              required
              disabled={editSubmitting}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Leader Email (login)
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={editLeaderEmail}
              onChange={(e) => setEditLeaderEmail(e.target.value)}
              required
              disabled={editSubmitting}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Leader Citizen ID
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={editLeaderCitizenId}
              onChange={(e) => setEditLeaderCitizenId(e.target.value)}
              required
              placeholder="13-digit"
              disabled={editSubmitting}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Used to generate the initial password hash.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="text-[13px] font-semibold text-gray-800">
              Club Members
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Update founding members. Must keep at least 5 total.
              Every row must be fully filled.
            </p>
          </div>

          <button
            type="button"
            onClick={addEditMemberRow}
            disabled={editSubmitting}
            className="px-2.5 py-1.5 text-[12px] rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Member
          </button>
        </div>

        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {editMembers.map((m, idx) => (
            <div
              key={idx}
              className="
                grid
                grid-cols-1
                md:grid-cols-[1fr_minmax(160px,220px)_minmax(140px,180px)_auto]
                gap-3
                items-start
                border border-gray-200 rounded-md p-3 bg-gray-50
              "
            >
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Full Name"
                  value={m.full_name}
                  onChange={(e) =>
                    updateEditMember(idx, "full_name", e.target.value)
                  }
                  disabled={editSubmitting}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="student@mfu.ac.th"
                  value={m.email}
                  onChange={(e) =>
                    updateEditMember(idx, "email", e.target.value)
                  }
                  disabled={editSubmitting}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Citizen ID
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="13-digit"
                  value={m.citizen_id}
                  onChange={(e) =>
                    updateEditMember(idx, "citizen_id", e.target.value)
                  }
                  disabled={editSubmitting}
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={editMembers.length <= 5 || editSubmitting}
                  onClick={() => removeEditMemberRow(idx)}
                  className="
                    text-[12px] text-red-600 hover:text-red-700
                    disabled:text-gray-300 disabled:cursor-not-allowed
                  "
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
