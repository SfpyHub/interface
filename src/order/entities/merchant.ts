import { DateTime } from 'luxon'

export interface MerchantProps {
  client_id?: string
  registered_name?: string
  website_url?: string
  twitter_url?: string
  instagram_url?: string
  profile_img_url?: string
  background_img_url?: string
  created_at?: string
  updated_at?: string
}

export class Merchant {
  private readonly client_id?: string
  private readonly registered_name?: string
  private readonly website_url?: string
  private readonly twitter_url?: string
  private readonly instagram_url?: string
  private readonly profile_img_url?: string
  private readonly background_img_url?: string
  private readonly created_at?: DateTime
  private readonly updated_at?: DateTime

  public constructor({
    client_id,
    registered_name,
    website_url,
    twitter_url,
    instagram_url,
    profile_img_url,
    background_img_url,
    created_at,
    updated_at,
  }: MerchantProps) {
    this.client_id = client_id
    this.registered_name = registered_name
    this.website_url = website_url
    this.twitter_url = twitter_url
    this.instagram_url = instagram_url
    this.profile_img_url = profile_img_url
    this.background_img_url = background_img_url
    this.created_at = created_at ? DateTime.fromISO(created_at) : undefined
    this.updated_at = updated_at ? DateTime.fromISO(updated_at) : undefined
  }

  public get id(): string {
    return this.client_id
  }

  public get name(): string {
    return this.registered_name
  }

  public get backgroundImg(): string {
    return this.background_img_url
  }

  public get profileImg(): string {
    return this.profile_img_url
  }

  public get websiteURL(): string {
    return this.website_url
  }

  public get instagramURL(): string {
    return this.instagram_url
  }

  public get twitterURL(): string {
    return this.twitter_url
  }

  public toJSON(): MerchantProps {
    return {
      registered_name: this.name,
      website_url: this.websiteURL,
      twitter_url: this.twitterURL,
      instagram_url: this.instagramURL,
      profile_img_url: this.profileImg,
      background_img_url: this.backgroundImg,
    }
  }
}
