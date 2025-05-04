import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRegistrationForm from './user_registration';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

global.fetch = vi.fn();

describe('UserRegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <UserRegistrationForm />
      </MemoryRouter>
    );
  };

  function fillValidForm() {
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/^Address$/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByLabelText(/National Identity Card/i), { target: { value: '123456789V' } });
    fireEvent.change(screen.getByLabelText(/TIN Number/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Salon Name/i), { target: { value: 'Best Salon' } });
    fireEvent.change(screen.getByLabelText(/Salon Address/i), { target: { value: '456 Salon St' } });
    fireEvent.change(screen.getByPlaceholderText(/Area of Story 1/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password!' } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), { target: { value: 'password!' } });
  }

  it('validates invalid NIC format', async () => {
    renderComponent();
    fillValidForm();
    fireEvent.change(screen.getByLabelText(/National Identity Card/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Invalid NIC format (e.g., 123456789V or 200012345678)');
    });
  });

  it('validates negative area input', async () => {
    renderComponent();
    fillValidForm();
    fireEvent.change(screen.getByPlaceholderText(/Area of Story 1/i), { target: { value: '-50' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Salon area must be a positive number.');
    });
  });

  it('submits valid form successfully', async () => {
    renderComponent();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Success!' })
    });
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(global.alert).toHaveBeenCalledWith('Success!');
    });
  });

  it('handles server error gracefully', async () => {
    renderComponent();
    global.fetch.mockResolvedValueOnce({ ok: false });
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Registration failed!');
    });
  });
});
