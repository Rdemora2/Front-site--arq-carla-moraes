import React from "react";
import tw from "twin.macro";
import EmailNewsletterIconBase from "../../images/email-newsletter-icon.svg";
import { Container as ContainerBase } from "components/misc/Layouts.jsx";
import { SectionHeading } from "components/misc/Headings.jsx";
import { PrimaryButton } from "components/misc/Buttons.jsx";

const Container = tw(ContainerBase)`bg-secondary-800 -mx-8`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const Row = tw.div`flex items-center justify-center flex-col lg:flex-row px-8`;
const TextColumn = tw.div`flex items-center flex-col sm:flex-row`;
const FormColumn = tw.div`mt-12 lg:mt-0 lg:ml-16 w-full sm:w-auto`;

const EmailNewsletterIcon = tw(
  EmailNewsletterIconBase
)`w-16 h-16 text-green-500`;
const HeadingInfoContainer = tw.div`sm:ml-6 mt-6 sm:mt-0`;
const Heading = tw(SectionHeading)`text-gray-100 sm:text-left leading-none`;
const Description = tw.p`text-gray-500 font-medium text-sm max-w-sm mt-2 sm:mt-1 text-center sm:text-left`;

const Form = tw.form`text-sm max-w-sm sm:max-w-none mx-auto`;
const Input = tw.input`w-full sm:w-auto block sm:inline-block px-6 py-4 rounded bg-secondary-600 tracking-wider font-bold border border-secondary-600 focus:border-secondary-300 focus:outline-none sm:rounded-r-none hover:bg-secondary-500 transition duration-300 text-gray-200`;
const Button = tw(
  PrimaryButton
)`w-full sm:w-auto mt-6 sm:mt-0 sm:rounded-l-none py-4 bg-green-500 text-gray-100 hocus:bg-green-700 hocus:text-gray-300 border border-green-500 hocus:border-green-700`;

export default ({
  subheading = "Fique por dentro",
  heading = "Assine Nossa Newsletter",
  description = "Receba inspirações, tendências e novidades sobre paisagismo diretamente em seu e-mail. Compartilhamos nosso conhecimento e projetos exclusivos mensalmente.",
  formAction = "#",
  formMethod = "get",
  textOnLeft = true,
  submitButtonText = "Inscrever-se",
}) => {
  return (
    <Container>
      <Content>
        <Row>
          <TextColumn>
            <EmailNewsletterIcon />
            <HeadingInfoContainer>
              <Heading>{heading}</Heading>
              <Description>{description}</Description>
            </HeadingInfoContainer>
          </TextColumn>
          <FormColumn>
            <Form action={formAction} method={formMethod}>
              <Input
                name="newsletter"
                type="email"
                placeholder="Seu Endereço de Email"
              />
              <Button type="submit">{submitButtonText}</Button>
            </Form>
          </FormColumn>
        </Row>
      </Content>
    </Container>
  );
};
