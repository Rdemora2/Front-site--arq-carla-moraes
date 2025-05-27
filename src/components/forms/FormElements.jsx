import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";
import tw from "twin.macro";

// Animações
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// Container base para todos os inputs
const InputContainer = styled.div`
  ${tw`relative mb-5`}
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
`;

// Estilos base para inputs
const baseInputStyles = css`
  ${tw`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-300 bg-white`}
  border-color: ${(props) => {
    if (props.hasError) return "#ef4444";
    if (props.isValid) return "#10b981";
    return "#d1d5db";
  }};

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.hasError ? "#ef4444" : "var(--color-primary)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(239, 68, 68, 0.1)" : "rgba(62, 77, 44, 0.1)"};
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${(props) =>
      props.hasError ? "#ef4444" : "var(--color-secondary)"};
  }

  &::placeholder {
    ${tw`text-gray-400 transition-opacity duration-300`}
  }

  &:focus::placeholder {
    opacity: 0.7;
  }

  ${(props) =>
    props.hasError &&
    css`
      animation: ${shake} 0.4s ease-in-out;
    `}
  &:disabled {
    ${tw`bg-gray-100 text-gray-400 cursor-not-allowed`}
    border-color: #e5e7eb;
  }
`;

// Componente Input
const StyledInput = styled.input`
  ${baseInputStyles}
`;

// Componente TextArea
const StyledTextArea = styled.textarea`
  ${baseInputStyles}
  ${tw`resize-none`}
  min-height: 120px;
`;

// Label flutuante
const FloatingLabel = styled.label`
  ${tw`absolute transition-all duration-300 pointer-events-none select-none`}
  left: 1rem;
  font-size: ${(props) => (props.isFloating ? "0.875rem" : "1rem")};
  top: ${(props) => (props.isFloating ? "-0.5rem" : "0.75rem")};
  background-color: ${(props) => (props.isFloating ? "white" : "transparent")};
  padding: ${(props) => (props.isFloating ? "0 0.25rem" : "0")};
  color: ${(props) => {
    if (props.hasError) return "#ef4444";
    if (props.isFocused) return "var(--color-primary)";
    return "#6b7280";
  }};
  font-weight: ${(props) => (props.isFloating ? "500" : "400")};
`;

// Mensagem de erro
const ErrorMessage = styled.div`
  ${tw`mt-2 text-sm font-medium flex items-center`}
  color: #ef4444;
  animation: ${fadeIn} 0.3s ease-out;

  svg {
    ${tw`w-4 h-4 mr-1 flex-shrink-0`}
  }
`;

// Mensagem de sucesso
const SuccessMessage = styled.div`
  ${tw`mt-2 text-sm font-medium flex items-center`}
  color: #10b981;
  animation: ${fadeIn} 0.3s ease-out;

  svg {
    ${tw`w-4 h-4 mr-1 flex-shrink-0`}
  }
`;

// Helper text
const HelperText = styled.div`
  ${tw`mt-2 text-sm text-gray-500`}
`;

// Contador de caracteres
const CharacterCount = styled.div`
  ${tw`absolute text-xs`}
  bottom: 0.5rem;
  right: 0.75rem;
  color: ${(props) => {
    if (props.isOverLimit) return "#ef4444";
    if (props.isNearLimit) return "#f59e0b";
    return "#9ca3af";
  }};
`;

// Ícones
const ErrorIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

// Componente FormInput
export const FormInput = forwardRef(
  (
    {
      name,
      label,
      error,
      helperText,
      showSuccess = false,
      successMessage = "Válido",
      maxLength,
      showCharCount = false,
      delay = "0s",
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [value, setValue] = React.useState(
      props.value || props.defaultValue || ""
    );

    const hasError = Boolean(error);
    const isValid = showSuccess && !hasError && value.length > 0;
    const isFloating = isFocused || value.length > 0;

    const handleFocus = (e) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    // Calcular status do contador de caracteres
    const charCount = value.length;
    const isNearLimit = maxLength && charCount >= maxLength * 0.8;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <InputContainer delay={delay} className={className}>
        <div className="relative">
          <StyledInput
            ref={ref}
            name={name}
            id={name}
            hasError={hasError}
            isValid={isValid}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={maxLength}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${name}-error`
                : helperText
                  ? `${name}-helper`
                  : undefined
            }
            {...props}
          />

          {label && (
            <FloatingLabel
              htmlFor={name}
              isFloating={isFloating}
              isFocused={isFocused}
              hasError={hasError}
            >
              {label}
            </FloatingLabel>
          )}

          {showCharCount && maxLength && (
            <CharacterCount isNearLimit={isNearLimit} isOverLimit={isOverLimit}>
              {charCount}/{maxLength}
            </CharacterCount>
          )}
        </div>

        {hasError && (
          <ErrorMessage id={`${name}-error`} role="alert">
            <ErrorIcon />
            {error}
          </ErrorMessage>
        )}

        {isValid && (
          <SuccessMessage>
            <SuccessIcon />
            {successMessage}
          </SuccessMessage>
        )}

        {helperText && !hasError && (
          <HelperText id={`${name}-helper`}>{helperText}</HelperText>
        )}
      </InputContainer>
    );
  }
);

FormInput.displayName = "FormInput";

// Componente FormTextArea
export const FormTextArea = forwardRef(
  (
    {
      name,
      label,
      error,
      helperText,
      showSuccess = false,
      successMessage = "Válido",
      maxLength,
      showCharCount = true,
      delay = "0s",
      rows = 4,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [value, setValue] = React.useState(
      props.value || props.defaultValue || ""
    );

    const hasError = Boolean(error);
    const isValid = showSuccess && !hasError && value.length > 0;
    const isFloating = isFocused || value.length > 0;

    const handleFocus = (e) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    // Calcular status do contador de caracteres
    const charCount = value.length;
    const isNearLimit = maxLength && charCount >= maxLength * 0.8;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <InputContainer delay={delay} className={className}>
        <div className="relative">
          <StyledTextArea
            ref={ref}
            name={name}
            id={name}
            rows={rows}
            hasError={hasError}
            isValid={isValid}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={maxLength}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${name}-error`
                : helperText
                  ? `${name}-helper`
                  : undefined
            }
            {...props}
          />

          {label && (
            <FloatingLabel
              htmlFor={name}
              isFloating={isFloating}
              isFocused={isFocused}
              hasError={hasError}
            >
              {label}
            </FloatingLabel>
          )}

          {showCharCount && maxLength && (
            <CharacterCount isNearLimit={isNearLimit} isOverLimit={isOverLimit}>
              {charCount}/{maxLength}
            </CharacterCount>
          )}
        </div>

        {hasError && (
          <ErrorMessage id={`${name}-error`} role="alert">
            <ErrorIcon />
            {error}
          </ErrorMessage>
        )}

        {isValid && (
          <SuccessMessage>
            <SuccessIcon />
            {successMessage}
          </SuccessMessage>
        )}

        {helperText && !hasError && (
          <HelperText id={`${name}-helper`}>{helperText}</HelperText>
        )}
      </InputContainer>
    );
  }
);

FormTextArea.displayName = "FormTextArea";

// Componente Checkbox customizado
const CheckboxContainer = styled.div`
  ${tw`flex items-start mb-4`}
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${(props) => props.delay || "0s"};
  animation-fill-mode: both;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  ${tw`sr-only`}
`;

const StyledCheckbox = styled.div`
  ${tw`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-300 cursor-pointer mr-3 mt-1 flex-shrink-0`}
  border-color: ${(props) => {
    if (props.hasError) return "#ef4444";
    if (props.checked) return "var(--color-primary)";
    return "#d1d5db";
  }};
  background-color: ${(props) =>
    props.checked ? "var(--color-primary)" : "white"};

  &:hover {
    border-color: ${(props) =>
      props.hasError ? "#ef4444" : "var(--color-secondary)"};
    transform: scale(1.05);
  }

  svg {
    ${tw`w-3 h-3 text-white`}
    opacity: ${(props) => (props.checked ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

const CheckboxLabel = styled.label`
  ${tw`text-sm cursor-pointer select-none leading-relaxed`}
  color: ${(props) => (props.hasError ? "#ef4444" : "#374151")};

  a {
    color: var(--color-primary);
    ${tw`font-medium hover:underline`}
  }
`;

const CheckIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const FormCheckbox = ({
  name,
  label,
  error,
  checked,
  onChange,
  delay = "0s",
  className,
  ...props
}) => {
  const hasError = Boolean(error);

  const handleClick = () => {
    onChange?.({ target: { name, checked: !checked } });
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={className}>
      <CheckboxContainer delay={delay}>
        <HiddenCheckbox
          name={name}
          checked={checked}
          onChange={onChange}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        <StyledCheckbox
          hasError={hasError}
          checked={checked}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="checkbox"
          aria-checked={checked}
          aria-invalid={hasError}
        >
          <CheckIcon />
        </StyledCheckbox>
        <CheckboxLabel
          hasError={hasError}
          onClick={handleClick}
          dangerouslySetInnerHTML={{ __html: label }}
        />
      </CheckboxContainer>

      {hasError && (
        <ErrorMessage id={`${name}-error`} role="alert">
          <ErrorIcon />
          {error}
        </ErrorMessage>
      )}
    </div>
  );
};

// PropTypes para FormInput
FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  showSuccess: PropTypes.bool,
  successMessage: PropTypes.string,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  delay: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormInput.defaultProps = {
  showSuccess: false,
  successMessage: "Válido",
  showCharCount: false,
  delay: "0s",
};

// PropTypes para FormTextArea
FormTextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  showSuccess: PropTypes.bool,
  successMessage: PropTypes.string,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  delay: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormTextArea.defaultProps = {
  showSuccess: false,
  successMessage: "Válido",
  showCharCount: true,
  delay: "0s",
  rows: 4,
};

// PropTypes para FormCheckbox
FormCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  delay: PropTypes.string,
  className: PropTypes.string,
};

FormCheckbox.defaultProps = {
  checked: false,
  delay: "0s",
};

export default {
  FormInput,
  FormTextArea,
  FormCheckbox,
};
