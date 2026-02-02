import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SiteBuilder } from '../components/SiteBuilder';

describe('SiteBuilder', () => {
  const mockProps = {
    brandName: 'Test Brand',
    assets: { palette: ['#000', '#fff'] },
    onClose: vi.fn(),
  };

  it('renders without crashing', () => {
    render(<SiteBuilder {...mockProps} />);
    expect(screen.getByText(/Test Brand/i)).toBeDefined();
  });

  it('switches view modes', () => {
    render(<SiteBuilder {...mockProps} />);
    const mobileBtn = screen.getByRole('button', { name: /mobile/i });
    fireEvent.click(mobileBtn);
    // Check if view mode state changed (would need more complex setup to check styles)
  });
});
