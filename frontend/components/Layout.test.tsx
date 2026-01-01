/**
 * Test module for Layout navigation links.
 *
 * Coverage:
 * - Navigation links use next/link Link component
 * - Each link has correct href attribute
 *
 * TDD Red Phase: These tests should FAIL with current <a> tag implementation
 * and PASS after migrating to next/link Link component.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Layout from "./Layout";

// Mock next/link to track Link component usage
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return (
      <a href={href} data-testid="next-link" {...props}>
        {children}
      </a>
    );
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => "light"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Navigation Link Component Tests ====================

  describe("Navigation Links", () => {
    describe("when using next/link Link component", () => {
      it("should use Link component for About navigation", () => {
        render(<Layout>Content</Layout>);

        const aboutLink = screen.getByRole("link", { name: "About" });
        expect(aboutLink).toHaveAttribute("data-testid", "next-link");
      });

      it("should use Link component for Projects navigation", () => {
        render(<Layout>Content</Layout>);

        const projectsLink = screen.getByRole("link", { name: "Projects" });
        expect(projectsLink).toHaveAttribute("data-testid", "next-link");
      });

      it("should use Link component for Chat navigation", () => {
        render(<Layout>Content</Layout>);

        const chatLink = screen.getByRole("link", { name: "Chat" });
        expect(chatLink).toHaveAttribute("data-testid", "next-link");
      });

      it("should use Link component for capsule-rsc navigation", () => {
        render(<Layout>Content</Layout>);

        const capsuleLink = screen.getByRole("link", { name: "capsule-rsc" });
        expect(capsuleLink).toHaveAttribute("data-testid", "next-link");
      });
    });

    // ==================== Href Attribute Tests ====================

    describe("when verifying href attributes", () => {
      it("should have correct href for About link", () => {
        render(<Layout>Content</Layout>);

        const aboutLink = screen.getByRole("link", { name: "About" });
        expect(aboutLink).toHaveAttribute("href", "/#about");
      });

      it("should have correct href for Projects link", () => {
        render(<Layout>Content</Layout>);

        const projectsLink = screen.getByRole("link", { name: "Projects" });
        expect(projectsLink).toHaveAttribute("href", "/#projects");
      });

      it("should have correct href for Chat link", () => {
        render(<Layout>Content</Layout>);

        const chatLink = screen.getByRole("link", { name: "Chat" });
        expect(chatLink).toHaveAttribute("href", "/#chat");
      });

      it("should have correct href for capsule-rsc link", () => {
        render(<Layout>Content</Layout>);

        const capsuleLink = screen.getByRole("link", { name: "capsule-rsc" });
        expect(capsuleLink).toHaveAttribute("href", "/capsule-rsc");
      });
    });
  });
});
